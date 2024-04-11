import React from 'react'

interface ButtonProps {
    children: React.ReactNode
}

export default function Button({ children }: ButtonProps) {
    return (
        <button type="button">{children}</button>
    )
}