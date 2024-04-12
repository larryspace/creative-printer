import { Meta, StoryObj } from '@storybook/react'
import Designer from './Designer'

export default {
  component: Designer,
  title: 'Printer Template Designer',
}

type Story = StoryObj<typeof Designer>

export const designer: Story = {
  args: {
    onChange: (templateJSON) => console.log(templateJSON),
    value: undefined,
  }
}