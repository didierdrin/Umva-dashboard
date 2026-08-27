// src/components/AnimatedNumber.jsx
import React, { useEffect, useRef, useState } from 'react'

const defaultFormat = (n) => Math.round(n).toLocaleString()

// Eases a number from its previous value to `value` on every change, rather
// than just formatting it — the motion is the point (stat cards feel alive
// instead of static text swapping).
const AnimatedNumber = ({ value = 0, duration = 900, format = defaultFormat }) => {
  const [display, setDisplay] = useState(0)
  const fromRef = useRef(0)

  useEffect(() => {
    const from = fromRef.current
    const to = Number(value) || 0
    if (from === to) return

    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (to - from) * eased)
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
        setDisplay(to)
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value, duration])

  return <>{format(display)}</>
}

export default AnimatedNumber
