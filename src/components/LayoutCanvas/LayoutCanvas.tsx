import { TemplateElement } from '../../types'

interface LayoutCanvasProps {
  elements: TemplateElement[]
}

export default function LayoutCanvas({ elements }: LayoutCanvasProps) {
  return (
    <div>
      {/* 元素列表 */}
      <div>{elements.map(item => (<div key={item.id}>{item.type}</div>))}</div>

      {/* 栅格 */}
      <div></div>
    </div>
  )
}