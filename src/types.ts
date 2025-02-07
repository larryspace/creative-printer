// 页面单位
export type PageUnit = 'px' | 'mm' | 'cm' | 'inch';

// 页面方向
export type PageOrientation = 'portrait' | 'landscape';

// 页面结构
export interface PageSettings {
  width: number;
  height: number;
  unit: PageUnit;
  orientation: PageOrientation;
  margins?: { top: number; left: number; right: number; bottom: number };
}

export interface LayoutRules {
  align?: 'left' | 'center' | 'right'; // 水平对齐方式
  verticalAlign?: 'top' | 'middle' | 'bottom'; // 垂直对齐方式
  relativeTo?: string; // 依赖的元素 ID
  offsetX?: number; // X 轴偏移
  offsetY?: number; // Y 轴偏移
}

// 组件的位置信息
export interface Position {
  x: number;
  y: number;
}

// 组件的基础样式
export interface BaseStyle {
  fontSize?: number;
  bold?: boolean;
  color?: string;
}

// 公共的基础元素
interface BaseElement {
  id: string;
  type: string;
  position?: Position; // 允许为空
  layout?: LayoutRules; // 允许定义布局规则
}

// 文本组件
export interface TextElement extends BaseElement {
  type: 'text';
  style?: BaseStyle;
  content: string; // 可能包含动态变量，如 '客户：{{customer.name}}'
  binding?: string; // 绑定的数据字段
}

// 表格组件
export interface TableColumn {
  title: string;
  binding: string;
  width: number;
}

export interface TableElement extends BaseElement {
  type: 'table';
  columns: TableColumn[];
}

// 二维码组件
export interface QrCodeElement extends BaseElement {
  type: 'qrcode';
  size: number;
  content: string; // 可能是 '{{order.id}}'
  binding?: string;
}

// 允许的组件类型
export type TemplateElement = TextElement | TableElement | QrCodeElement;

export interface Template {
  page: PageSettings;
  elements: TemplateElement[];
}