import { useEffect } from 'react'

interface DesignerProps {
  onChange?: (value: string) => void
  value?: string
}

export default function Designer({ onChange, value }: DesignerProps) {

  useEffect(() => {
    console.log(value)
  }, [])

  return (
    <>
      <div>Designer</div>
      <button type="button" onClick={() => onChange?.(Math.random().toString(16))}>Update</button>
    </>
  )
}