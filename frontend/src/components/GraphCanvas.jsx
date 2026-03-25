import React, { useEffect, useRef, useCallback } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { buildElements, buildStylesheet } from '../lib/graphUtils';
import cytoscape from 'cytoscape';

export default function GraphCanvas({ graphData, onNodeClick, showOverlay, focusId, highlightIds }) {
    const cyRef = useRef(null);

    const layout = {
        name: 'cose',
        animate: true,
        animationDuration: 800,
        randomize: false,
        nodeOverlap: 24,
        fit: true,
        padding: 60,
    };

    const elements = graphData
        ? buildElements(graphData.nodes, graphData.edges)
        : [];

    const stylesheet = buildStylesheet();

    const handleCyInit = useCallback((cy) => {
        cyRef.current = cy;

        // Clean up any old listeners before adding new ones
        cy.off('tap');

        cy.on('tap', 'node', (evt) => {
            const node = evt.target;
            const nodeId = node.id();

            // Notify parent
            onNodeClick({
                id: nodeId,
                connections: node.degree(),
                data: node.data()
            });

            // Local highlighting
            cy.elements().addClass('faded').removeClass('highlighted');
            node.closedNeighborhood().removeClass('faded').addClass('highlighted');
        });

        cy.on('tap', (evt) => {
            if (evt.target === cy) {
                cy.elements().removeClass('highlighted faded');
                onNodeClick(null);
            }
        });
    }, [onNodeClick]);


    // Handle AI Focus & Highlighting
    useEffect(() => {
        const cy = cyRef.current;
        if (!cy) return;

        if (focusId) {
            const target = cy.$(`#${focusId}`);
            if (target.length) {
                cy.animate({
                    center: { eles: target },
                    zoom: 1.8,
                    duration: 1000,
                    easing: 'ease-out-expo'
                });

                cy.elements().addClass('faded').removeClass('highlighted');
                target.closedNeighborhood().removeClass('faded').addClass('highlighted');
            }
        }
    }, [focusId]);

    useEffect(() => {
        const cy = cyRef.current;
        if (!cy || !highlightIds || highlightIds.length === 0) return;

        cy.elements().addClass('faded').removeClass('highlighted');
        highlightIds.forEach(id => {
            cy.$(`#${id}`).removeClass('faded').addClass('highlighted');
        });
    }, [highlightIds]);

    useEffect(() => {
        const cy = cyRef.current;
        if (!cy) return;
        cy.style()
            .selector('node')
            .style({ 'label': showOverlay ? 'data(label)' : '' })
            .update();
    }, [showOverlay]);

    return (
        <CytoscapeComponent
            elements={elements}
            stylesheet={stylesheet}
            layout={layout}
            cy={handleCyInit}
            style={{ width: '100%', height: '100%' }}
            wheelSensitivity={0.2}
        />
    );
}
