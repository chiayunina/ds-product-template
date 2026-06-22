// 2026-05-26 完整 AppShell product layout 範例
// Per user「預設應該是 app shells 的範例」directive — fork user 看 Storybook 直接看到
// 真實 product 起點(Sidebar + Header + Page),不是孤立 Button。

import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { Button, TooltipProvider } from '@qijenchen/design-system'
import App, { BulkUpdateDialog } from './App'

const meta: Meta<typeof App> = {
  title: 'Apps/template/AppShell Dashboard',
  component: App,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'AppShell Dashboard demo — DS canonical `AppShell + Sidebar + PageHeader` 完整 layout。\n\n' +
          '客製 `App.tsx` 內的:\n' +
          '- `NAV` array(sidebar navigation 項目)\n' +
          '- `PageHeader` content(business-specific 標題 / actions)\n' +
          '- Page component(DashboardPage / OrderListPage / etc.)\n\n' +
          'SSOT 鐵律:只 import `@qijenchen/design-system` exports,**禁修改 DS source**。\n\n' +
          '從 template 衍生新 app:`npm run create-app <kebab-case-name>`。',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof App>

export const Default: Story = {
  name: 'Dashboard 預設',
}


function BulkUpdateDialogStory() {
  const [open, setOpen] = useState(true)

  return (
    <TooltipProvider delayDuration={500} skipDelayDuration={300}>
      <div className="min-h-screen bg-surface p-8">
        <Button variant="primary" size="md" onClick={() => setOpen(true)}>開啟批次更新</Button>
        <BulkUpdateDialog open={open} onOpenChange={setOpen} />
      </div>
    </TooltipProvider>
  )
}

export const BulkUpdateDialogOpen: StoryObj<typeof BulkUpdateDialogStory> = {
  name: '批次更新視窗 / 開啟狀態',
  render: () => <BulkUpdateDialogStory />,
  parameters: {
    docs: {
      description: {
        story: '用 Storybook 直接檢查批次更新彈出式視窗的初始視覺、欄位選擇、下載範本與上傳入口。',
      },
    },
  },
}
