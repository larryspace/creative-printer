import React from 'react'

interface ButtonProps {
    children: React.ReactElement
}

export default function Button({ children }: ButtonProps) {
    return (
        <button type="button">{children}</button>
    )
}