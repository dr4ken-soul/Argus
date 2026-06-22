import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface BlurTextProps {
  text: string
  className?: string
  delay?: number
}

/**
 * Word-by-word blur-in headline reveal.
 * @param delay - Seconds before first word starts animating
 */
export function BlurText({ text, className = '', delay = 0.5 }: BlurTextProps) {
  const [inView, setInView] = useState(false)
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true)
      },
      { threshold: 0.1 },
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <h1 ref={ref} className={className}>
      {text.split(' ').map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={
            inView
              ? { filter: 'blur(0px)', opacity: 1, y: 0 }
              : {}
          }
          transition={{
            duration: 0.7,
            ease: 'easeOut',
            delay: delay + index * 0.1,
          }}
          className="inline-block mr-[0.28em]"
        >
          {word}
        </motion.span>
      ))}
    </h1>
  )
}
