import type { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface FadeInProps {
  children: ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
}

/**
 * Blur-in fade entrance wrapper used for section reveals.
 * @param delay - Seconds before animation starts
 * @param y - Vertical offset to animate from
 */
export function FadeIn({ children, delay = 0, duration = 0.7, y = 20, className = '' }: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)', y }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
