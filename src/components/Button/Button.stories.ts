import { StoryObj, Meta } from '@storybook/react'
import React from 'react'

import Button from './Button'

export default {
    component: Button,
    title: 'Button'
}

type Story = StoryObj<typeof Button>

export const base: Story = {
    args: {
        children: 'Submit',
    }
}