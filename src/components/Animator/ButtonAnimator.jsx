import { motion } from 'framer-motion';
import React from 'react';

// --- 1. Button Physics ---
const buttonTransition = (isPressed) => ({
    type: "spring",
    stiffness: isPressed ? 80 : 180,
    damping: isPressed ? 25 : 18,
    mass: isPressed ? 1.2 : 1
});

// --- 2. Button Container Variants ---
const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.03 },
    pressed: { scale: 0.98 }
};

// --- 2. Text Variants ---
const textVariants = {
    initial: { scaleX: 1, scaleY: 1, y: 0, opacity: 1, letterSpacing: "0em" },
    hover: { scale: 1.02, y: -1 },
    pressed: { scaleX: 1.15, scaleY: 0.98, y: 2, opacity: 0.95 }
};

// --- 6. Expansion Item Variants ---
const expansionItemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 }
};
const ButtonAnimator = ({
    type = 'button',
    active = false,
    children,
    as = 'div',
    className = '',
    ...props
}) => {
    let variants = {};
    let transition = {};
    let initial = "initial";
    let animate = "initial";

    // --- 1. Standard Button ---
    if (type === 'button') {
        variants = buttonVariants;
        transition = buttonTransition(active);
        animate = active ? "pressed" : "hover"; // Default state is hover/initial
    }
    // --- 2. Button Text ---
    else if (type === 'text') {
        variants = textVariants;
        transition = { duration: 0.1 };
        animate = active ? "pressed" : "initial";
    }

    // --- 5. Expansion Item ---
    else if (type === 'expansionItem') {
        variants = expansionItemVariants;
        transition = { duration: 0.3 }; // Or use specific transition if needed
        animate = "visible"; // Items are always visible once mounted if using exit prop
        initial = "hidden";
        animate = "visible";
    }

    const Component = motion[as];

    return (
        <Component
            className={className}
            variants={variants}
            initial={initial}
            animate={animate}
            transition={transition}
            {...props}
        >
            {children}
        </Component>
    );
};

export default ButtonAnimator;
