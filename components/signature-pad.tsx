"use client"

import { useRef, useEffect, useState } from "react"
import SignaturePadLib from "signature_pad"
import { Button } from "@/components/ui/button"

interface SignaturePadProps {
  onSave: (data: string) => void
}

export default function SignaturePad({ onSave }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signaturePadRef = useRef<SignaturePadLib | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current

      // Set canvas width and height to match parent container
      const parentWidth = canvas.parentElement?.clientWidth || 300
      canvas.width = parentWidth
      canvas.height = 200

      signaturePadRef.current = new SignaturePadLib(canvas, {
        backgroundColor: "rgb(255, 255, 255)",
        penColor: "rgb(0, 0, 0)",
      })

      signaturePadRef.current.addEventListener("endStroke", () => {
        setIsEmpty(signaturePadRef.current?.isEmpty() || true)
      })
    }

    return () => {
      signaturePadRef.current?.off()
    }
  }, [])

  const handleClear = () => {
    signaturePadRef.current?.clear()
    setIsEmpty(true)
  }

  const handleSave = () => {
    if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
      const dataURL = signaturePadRef.current.toDataURL("image/png")
      onSave(dataURL)
    }
  }

  return (
    <div className="space-y-2">
      <div className="border border-gray-300 rounded-md bg-white">
        <canvas ref={canvasRef} className="w-full touch-none" />
      </div>
      <div className="flex space-x-2">
        <Button type="button" variant="outline" onClick={handleClear} className="flex-1">
          Clear
        </Button>
        <Button type="button" onClick={handleSave} disabled={isEmpty} className="flex-1">
          Save Signature
        </Button>
      </div>
    </div>
  )
}
