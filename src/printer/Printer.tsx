import usePrinter from './usePrinter'

interface PrinterProps {
  printer: PrinterProps
}

export default function Printer({ printer }: PrinterProps) {
  console.log(printer)

  return (
    <div>
      <button type="button">Print</button>
    </div>
  )
}

Printer.usePrinter = usePrinter