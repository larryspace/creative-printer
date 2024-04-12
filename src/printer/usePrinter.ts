import { useCallback } from 'react'

interface PrintTemplate {}

interface PrintData {}

interface PrintGroupItem {
  template: PrintTemplate
  data: PrintData[]
}

interface Printer {
  print: (printGroup: PrintGroupItem[]) => void;
}

export default function usePrinter(): Printer {
  const print = useCallback((printGroup: PrintGroupItem[]) => {
    console.log(printGroup)
  }, [])

  return {
    print
  }
}
