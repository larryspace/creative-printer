export default function creativePrint(content: JSX.Element) {
  // 创建隐藏 iframe
  const iframe = document.createElement('iframe');
  document.body.appendChild(iframe);
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';

  const doc = iframe.contentDocument || iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(`
    <html>
      <head>
        <title>CREATIVE PRINTER</title>
        <style>
          @media print {
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid black; padding: 8px; text-align: left; }
          }
        </style>
      </head>
      <body>
        <div id="creative-print-root"></div>
      </body>
    </html>
  `);
  doc.close();

  // 使用 React 渲染到 iframe
  import('react-dom/client').then(({ createRoot }) => {
    const rootElement = doc.getElementById('creative-print-root');
    if (!rootElement) return;

    const root = createRoot(rootElement);
    root.render(content);

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      document.body.removeChild(iframe);
    }, 500);
  });
}