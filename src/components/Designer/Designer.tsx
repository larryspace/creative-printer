import { useEffect, useState, useRef, useMemo } from 'react'
import { LayoutCanvas } from '../LayoutCanvas'
import type { PageSettings, TemplateElement } from '../../types'

import styles from './Designer.module.css'

interface DesignerProps {
  onChange?: (value: string) => void
  value?: string
}

export default function Designer({ onChange, value }: DesignerProps) {
  const [internalValue, setInternalValue] = useState(value)
  const lastValueRef = useRef(value)
  const [elements, setElements] = useState<TemplateElement[]>([])
  const [pageSettings, setPageSettings] = useState<PageSettings>(() => ({
    width: 100,
    height: 100,
    unit: 'mm',
    orientation: 'portrait'
  }))

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
    <div className={styles.canvasWraper}>
      <h4>Creative Printer</h4>
      <div className={styles.canvasToolbar}>
        <span>文本</span>
        <span>列表</span>
        <span>表格</span>
        <span>图片</span>
        <span>条形码</span>
        <span>二维码</span>
        <span>线条</span>
        <span>矩形</span>
        <span>圆形</span>
      </div>
      <LayoutCanvas elements={elements} />
      <button
        type="button"
        onClick={() => {
          const value = JSON.stringify({});
          setInternalValue(value)
          onChange?.(value)
        }}
      >
        UPDATE
      </button>
      <div>{template}</div>
    </div>
  )
}