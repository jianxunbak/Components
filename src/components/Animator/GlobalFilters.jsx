import React, { useLayoutEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';

/**
 * GlobalFilters - The SVG Sync Engine
 * Renders the complex SVG filters once at the root level.
 * 
 * --- THE BRIDGE ---
 * Browsers do not support var() inside SVG attributes (stdDeviation, dx, dy).
 * This component reads the --neu-svg-* variables from design-tokens.css
 * and applies them as pure numbers via refs.
 * 
 * Update: Uses useLayoutEffect to prevent FOUC (Flash of Unstyled Content).
 */
const GlobalFilters = () => {
    const { theme } = useTheme();
    const blurDarkRef = useRef(null);
    const blurLightRef = useRef(null);
    const offsetDarkRef = useRef(null);
    const offsetLightRef = useRef(null);

    const blurDarkSubtleRef = useRef(null);
    const blurLightSubtleRef = useRef(null);
    const offsetDarkSubtleRef = useRef(null);
    const offsetLightSubtleRef = useRef(null);

    const inBevelShadowBlurRef = useRef(null);
    const inBevelHighlightBlurRef = useRef(null);
    const inBevelShadowOffsetRef = useRef(null);
    const inBevelHighlightOffsetRef = useRef(null);

    const inBevelShadowBlurSubtleRef = useRef(null);
    const inBevelHighlightBlurSubtleRef = useRef(null);
    const inBevelShadowOffsetSubtleRef = useRef(null);
    const inBevelHighlightOffsetSubtleRef = useRef(null);

    useLayoutEffect(() => {
        const rootStyle = window.getComputedStyle(document.documentElement);
        const getVal = (name) => rootStyle.getPropertyValue(name).trim();

        // Sync Standard Filter
        if (blurDarkRef.current) blurDarkRef.current.setAttribute('stdDeviation', getVal('--neu-svg-blur-dark'));
        if (blurLightRef.current) blurLightRef.current.setAttribute('stdDeviation', getVal('--neu-svg-blur-light'));
        if (offsetDarkRef.current) {
            offsetDarkRef.current.setAttribute('dx', getVal('--neu-svg-offset-dark'));
            offsetDarkRef.current.setAttribute('dy', getVal('--neu-svg-offset-dark'));
        }
        if (offsetLightRef.current) {
            offsetLightRef.current.setAttribute('dx', getVal('--neu-svg-offset-light'));
            offsetLightRef.current.setAttribute('dy', getVal('--neu-svg-offset-light'));
        }

        // Sync Subtle Filter (50% intensity)
        const dBlur = parseFloat(getVal('--neu-svg-blur-dark')) / 2;
        const lBlur = parseFloat(getVal('--neu-svg-blur-light')) / 2;
        const oDark = parseFloat(getVal('--neu-svg-offset-dark')) / 2;
        const oLight = parseFloat(getVal('--neu-svg-offset-light')) / 2;

        if (blurDarkSubtleRef.current) blurDarkSubtleRef.current.setAttribute('stdDeviation', dBlur);
        if (blurLightSubtleRef.current) blurLightSubtleRef.current.setAttribute('stdDeviation', lBlur);
        if (offsetDarkSubtleRef.current) {
            offsetDarkSubtleRef.current.setAttribute('dx', oDark);
            offsetDarkSubtleRef.current.setAttribute('dy', oDark);
        }
        if (offsetLightSubtleRef.current) {
            offsetLightSubtleRef.current.setAttribute('dx', oLight);
            offsetLightSubtleRef.current.setAttribute('dy', oLight);
        }

        // Bevels
        const bevelSize = parseFloat(getVal('--neu-svg-inner-bevel-size'));
        const bevelSizeSubtle = bevelSize / 2;

        if (inBevelShadowBlurRef.current) inBevelShadowBlurRef.current.setAttribute('stdDeviation', getVal('--neu-svg-inner-highlight-blur'));
        if (inBevelHighlightBlurRef.current) inBevelHighlightBlurRef.current.setAttribute('stdDeviation', getVal('--neu-svg-inner-shadow-blur'));
        if (inBevelShadowOffsetRef.current) {
            inBevelShadowOffsetRef.current.setAttribute('dx', bevelSize);
            inBevelShadowOffsetRef.current.setAttribute('dy', bevelSize);
        }
        if (inBevelHighlightOffsetRef.current) {
            inBevelHighlightOffsetRef.current.setAttribute('dx', `-${bevelSize}`);
            inBevelHighlightOffsetRef.current.setAttribute('dy', `-${bevelSize}`);
        }

        if (inBevelShadowBlurSubtleRef.current) inBevelShadowBlurSubtleRef.current.setAttribute('stdDeviation', Math.max(0.5, parseFloat(getVal('--neu-svg-inner-highlight-blur')) / 2));
        if (inBevelHighlightBlurSubtleRef.current) inBevelHighlightBlurSubtleRef.current.setAttribute('stdDeviation', Math.max(0.5, parseFloat(getVal('--neu-svg-inner-shadow-blur')) / 2));
        if (inBevelShadowOffsetSubtleRef.current) {
            inBevelShadowOffsetSubtleRef.current.setAttribute('dx', bevelSizeSubtle);
            inBevelShadowOffsetSubtleRef.current.setAttribute('dy', bevelSizeSubtle);
        }
        if (inBevelHighlightOffsetSubtleRef.current) {
            inBevelHighlightOffsetSubtleRef.current.setAttribute('dx', `-${bevelSizeSubtle}`);
            inBevelHighlightOffsetSubtleRef.current.setAttribute('dy', `-${bevelSizeSubtle}`);
        }
    }, [theme]);

    return (
        <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
            <defs>
                {/* 1. RESTORED & OPTIMIZED FABRIC FILTER */}
                <filter id="fabric-depth-filter" x="-40%" y="-40%" width="180%" height="180%">
                    {/* Outer Shadow (Dark) - Optimized Blur */}
                    <feGaussianBlur ref={blurDarkRef} in="SourceAlpha" stdDeviation="5" result="blurOuterDark" />
                    <feOffset ref={offsetDarkRef} in="blurOuterDark" dx="4" dy="4" result="offsetOuterDark" />
                    <feFlood floodColor="var(--neu-shadow-dark)" result="floodOuterDark" />
                    <feComposite in="floodOuterDark" in2="offsetOuterDark" operator="in" result="shadowOuterDark" />

                    {/* Outer Highlight (Light) - Optimized Blur */}
                    <feGaussianBlur ref={blurLightRef} in="SourceAlpha" stdDeviation="3" result="blurOuterLight" />
                    <feOffset ref={offsetLightRef} in="blurOuterLight" dx="-4" dy="-4" result="offsetOuterLight" />
                    <feFlood floodColor="var(--neu-shadow-light)" result="floodOuterLight" />
                    <feComposite in="floodOuterLight" in2="offsetOuterLight" operator="in" result="shadowOuterLight" />

                    <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="featheredGraphic" />

                    {/* Internal Volume (The Dip) - Reduced from 40 to 12 for Safari Perf */}
                    <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="internalBlur" />
                    <feFlood floodColor="var(--neu-shadow-dark)" floodOpacity="var(--neu-svg-dip-opacity)" result="floodDip" />
                    <feComposite in="floodDip" in2="internalBlur" operator="in" result="internalVolume" />

                    {/* Inner Rim Shadow - Reduced from 15 to 6 */}
                    <feOffset ref={inBevelShadowOffsetRef} dx="6" dy="6" in="SourceAlpha" result="innerDishShadowOffset" />
                    <feComposite operator="out" in="SourceAlpha" in2="innerDishShadowOffset" result="innerDishShadowBevel" />
                    <feGaussianBlur ref={inBevelShadowBlurRef} in="innerDishShadowBevel" stdDeviation="6" result="blurInnerDishShadow" />
                    <feFlood floodColor="var(--neu-shadow-light)" floodOpacity="var(--neu-svg-inner-highlight-intensity)" result="floodInnerDishShadow" />
                    <feComposite in="floodInnerDishShadow" in2="blurInnerDishShadow" operator="in" result="highlightSoftLip" />

                    {/* Inner Rim Highlight - Reduced from 8 to 4 */}
                    <feOffset ref={inBevelHighlightOffsetRef} dx="-6" dy="-6" in="SourceAlpha" result="innerDishHighlightOffset" />
                    <feComposite operator="out" in="SourceAlpha" in2="innerDishHighlightOffset" result="innerDishHighlightBevel" />
                    <feGaussianBlur ref={inBevelHighlightBlurRef} in="innerDishHighlightBevel" stdDeviation="4" result="blurInnerDishHighlight" />
                    <feFlood floodColor="var(--neu-shadow-dark)" floodOpacity="var(--neu-svg-inner-shadow-intensity)" result="floodInnerDishHighlight" />
                    <feComposite in="floodInnerDishHighlight" in2="blurInnerDishHighlight" operator="in" result="shadowSoftLip" />

                    <feMerge>
                        <feMergeNode in="shadowOuterDark" />
                        <feMergeNode in="shadowOuterLight" />
                        <feMergeNode in="featheredGraphic" />
                        <feMergeNode in="internalVolume" />
                        <feMergeNode in="shadowSoftLip" />
                        <feMergeNode in="highlightSoftLip" />
                    </feMerge>
                </filter>

                {/* 2. SUBTLE FABRIC FILTER (For SearchBar, etc.) */}
                <filter id="fabric-subtle-filter" x="-20%" y="-20%" width="140%" height="140%">
                    {/* NO internal effects to keep edges strictly clean during animation */}
                    <feMerge>
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
        </svg>
    );
};

export default React.memo(GlobalFilters);
