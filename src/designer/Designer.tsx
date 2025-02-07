import { useEffect, useState, useRef, useMemo } from 'react'

interface DesignerProps {
  onChange?: (value: string) => void
  value?: string
}

export default function Designer({ onChange, value }: DesignerProps) {
  const [internalValue, setInternalValue] = useState(value)
  const lastValueRef = useRef(value)

  useEffect(() => {
    if (value !== lastValueRef.current) {
      lastValueRef.current = value
      setInternalValue(value)
    }
  }, [value])

  const template = useMemo(() => {
    return internalValue;
  }, [internalValue])

  return (
    <>
      <h4>Designer</h4>
      <button
        type="button"
        onClick={() => {
          const value = Math.random().toString(16)
          setInternalValue(value)
          onChange?.(value)
        }}
      >
        UPDATE
      </button>
      <div>{template}</div>
    </>
  )
}