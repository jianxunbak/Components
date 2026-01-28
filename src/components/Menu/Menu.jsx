import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical } from 'lucide-react';
import Button from '../Button/Button';
import { CardAnimator } from '../Animator';
import './Menu.css';

/**
 * A versatile Menu component that can collapse/expand.
 * Supports horizontal and vertical orientations and any number of buttons.
 * 
 * @param {React.ReactNode} children - Buttons or items to display in the menu.
 * @param {React.ReactNode} trigger - Custom trigger component (defaults to MoreVertical button).
 * @param {string} orientation - 'horizontal' or 'vertical' layout for items.
 * @param {string} placement - Position of the dropdown ('bottom-right', 'bottom-left', 'top-right', 'top-left').
 * @param {string} variant - Visual style variant.
 */
const Menu = ({
    children,
    trigger,
    orientation = 'vertical',
    placement = 'bottom-right',
    className = '',
    contentClassName = '',
    variant = 'default',
    ...props
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = (e) => {
        if (e) {
            e.stopPropagation();
            if (e.preventDefault) e.preventDefault();
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        const handleEscape = (e) => {
            if (e.key === 'Escape') setIsOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        document.addEventListener('keydown', handleEscape);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen]);

    const renderTrigger = () => {
        if (trigger) {
            return React.cloneElement(trigger, {
                onClick: (e) => {
                    if (trigger.props.onClick) trigger.props.onClick(e);
                    toggleMenu(e);
                },
                className: `${trigger.props.className || ''} ${isOpen ? 'active' : ''}`
            });
        }

        return (
            <Button
                className={`menu-trigger-btn ${isOpen ? 'active' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle menu"
            >
                <MoreVertical size={20} />
            </Button>
        );
    };

    return (
        <div className={`menu-wrapper ${className}`} ref={menuRef} {...props}>
            {renderTrigger()}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={`menu-dropdown-wrapper ${placement}`}
                        onClick={(e) => e.stopPropagation()}
                        variants={{
                            hidden: {
                                opacity: 0,
                                scale: 0.92,
                                y: placement.includes('bottom') ? -10 : 10,
                                filter: 'blur(10px)'
                            },
                            visible: {
                                opacity: 1,
                                scale: 1,
                                y: 0,
                                filter: 'blur(0px)',
                                transition: {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 30,
                                    staggerChildren: 0.08,
                                    delayChildren: 0.05
                                }
                            },
                            exit: {
                                opacity: 0,
                                scale: 0.95,
                                transition: { duration: 0.15, ease: "easeOut" }
                            }
                        }}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <CardAnimator
                            type={orientation === 'horizontal' ? 'fabricHorizontal' : 'fabricCard'}
                            active={isOpen}
                            className={`menu-content-container ${variant} ${contentClassName}`}
                            style={{
                                width: 'auto',
                                minWidth: 'unset',
                                height: 'auto',
                                padding: '0.8rem',
                            }}
                        >
                            <div
                                className={`menu-items-grid ${orientation}`}
                            >
                                {React.Children.map(children, (child, index) => (
                                    <motion.div
                                        key={index}
                                        variants={{
                                            hidden: { opacity: 0, y: 15, scale: 0.8 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                                transition: {
                                                    type: "spring",
                                                    stiffness: 300,
                                                    damping: 20
                                                }
                                            }
                                        }}
                                        style={{ display: 'flex' }}
                                    >
                                        {child}
                                    </motion.div>
                                ))}
                            </div>
                        </CardAnimator>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Menu;
