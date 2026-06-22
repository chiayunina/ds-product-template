// 完整 AppShell 範例 — 對齊 DS canonical `sidebar.stories.tsx#IconCollapse` baseline
// (per `.claude/rules/story-rules.md`「Production-grade composition fidelity」+ M23(d) nearest-same-purpose canonical wins)
//
// @story-baseline: @qijenchen/design-system/components/Sidebar/sidebar.stories.tsx#IconCollapse
// (2026-06-02 conformance-model:@story-baseline = consume canonical 結構的意圖,由靜態 conformance hook 驗
//  〔check_consumer_ds_primitive_misuse〔含 Pattern 8〕/ check_layout_space_magic_numbers / check_story_invariants
//  R7+R8〕。舊的 shell-only 視覺 identity-diff 標記已移除(此範本品牌 Acme Product / nav / 內容 by-design
//  異於 DS demo Acme Inc / MAIN_NAV,連 shell 文字都不同,pixel/DOM identity 即使遮罩內容也必 false-positive,
//  per composition-fidelity.md「禁拿產品範本 pixel 比 showcase」)。注意:此註解刻意不寫可被 diff script regex
//  解析的標記字面,以免「解釋移除」反而把標記種回去。)
//
// SSOT 鐵律:
//   - Consumer 只 import `@qijenchen/design-system` public exports
//   - 禁修改 DS source(走 fork DS repo)
//   - 視覺 token 透過 DS 提供的 `@qijenchen/design-system/styles/tokens` 載入
//
// Fork user 替換步驟:
//   1. 替換 NAV array(新 product 的真實導覽項)
//   2. 替換 WorkspaceBrand 內 workspace 名 / Avatar 顏色
//   3. 替換 DashboardPage 為真實業務 widgets(DataTable / Chart / Card 等 DS 元件)
//   4. 替換 PageHeader rightSlot 的 primary action(若有)

import { useEffect, useMemo, useState, type ReactElement } from 'react'
import {
  AppShell,
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  ChromeHeader,
  TooltipProvider,
  Avatar,
  ItemAvatar,
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  ProgressBar,
} from '@qijenchen/design-system'
import { LayoutDashboard, Users, Settings, FileText, BarChart3, Download, Upload, MailCheck } from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'orders', label: 'Orders', icon: FileText },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

// ── Sidebar(對齊 DS IconCollapse baseline:collapsible="icon" + WorkspaceBrand + footer)──
function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* Chrome header avatar canonical(per header-canonical.spec.md:57-72):chrome header 不是 row context → raw <Avatar size={24}>,禁用 <ItemAvatar>(會誤啟動 row anatomy lookup)*/}
        <div className="flex items-center gap-2 min-w-0 group-data-[collapsible=icon]:justify-center">
          <Avatar alt="Acme Product" size={24} shape="square" color="blue" solid />
          <span className="text-body-lg font-medium truncate group-data-[collapsible=icon]:hidden">Acme Product</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ id, label, icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton id={id} startIcon={icon} tooltip={label}>
                    {label}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {/* 對齊 DS canonical UserFooter(sidebar.stories.tsx):asChild + <div role="group"> + data-sidebar="menu-label" 必有,否則 SidebarMenuButton 把 children 全 wrap 進 ItemLabel 視覺垂直 stack */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div role="group" aria-label="當前使用者">
                <ItemAvatar alt="Current user" color="blue" />
                <span data-sidebar="menu-label" className="min-w-0 flex-1 truncate">當前使用者</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// ── PageHeader(消費 DS ChromeHeader primitive,2026-06-12 修:原手刻 <header className=...>
// 繞過 header-canonical 全部機械簽名 + 違反「消費 primitive 不 hand-craft」canonical;
// 對齊 _demo-helpers.tsx PageHeader 同款消費形)──
// SidebarTrigger 必有(primary-sidebar mode 的 menu toggle 入口,⌘B keyboard shortcut)
// rightSlot 型別用 ReactElement<any, any>(= 舊全域 JSX.Element 的去全域等價寫法):
//   - 不用裸 JSX.Element:React 19 @types/react 移除「全域」JSX namespace → `JSX.Element` 在 fresh React19 install
//     下 TS2503「Cannot find namespace 'JSX'」(本機 @types/react 19.2.15 仍含全域 shim → 源端 tsc 假陰性,
//     只在 receiver 拿到無 shim 的 19.x fresh install 才炸;2026-06-12 bde81e7e 引入,brick 下游 receiver build + audit)
//   - 不用裸 ReactElement:@types/react@19 預設參數由 any 改 unknown,`ReactElement<unknown>` 因 ReactPortal.children
//     分支不可指派給 ReactNode(TS2322)→ 必顯式 <any, any>(JSX.Element 本就是 ReactElement<any, any>,語意不變)
//   - 不用 ReactNode:workspace app 自帶 @types/react 副本與 DS .d.ts 的 ReactNode 版本 bigint 差異不相容
function PageHeader({ title, rightSlot }: { title: string; rightSlot?: ReactElement<any, any> }) {
  return (
    <ChromeHeader className="bg-surface">
      <SidebarTrigger />
      <h1 className="text-body-lg font-medium flex-1 truncate">{title}</h1>
      {rightSlot}
    </ChromeHeader>
  )
}


const BULK_UPDATE_FIELDS = [
  { id: 'customerName', label: '客戶名稱', hint: '要顯示在客戶清單與報表上的名稱' },
  { id: 'owner', label: '負責業務', hint: '負責此客戶或訂單的內部同仁' },
  { id: 'status', label: '狀態', hint: '例如 active、paused、closed' },
  { id: 'email', label: '通知 Email', hint: '更新完成通知與後續聯絡地址' },
  { id: 'note', label: '備註', hint: '補充說明或特殊處理需求' },
] as const

type BulkUpdateFieldId = (typeof BULK_UPDATE_FIELDS)[number]['id']
type BulkUpdateStep = 'chooseFields' | 'uploadTemplate' | 'confirm' | 'updating' | 'done'

function parseTemplateRows(text: string) {
  return text
    .trim()
    .split(/\r?\n/)
    .slice(1)
    .map((line) => line.trim())
    .filter(Boolean)
}

export function BulkUpdateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [selectedFields, setSelectedFields] = useState<BulkUpdateFieldId[]>(['customerName', 'status'])
  const [step, setStep] = useState<BulkUpdateStep>('chooseFields')
  const [fileName, setFileName] = useState<string>('')
  const [rowsToUpdate, setRowsToUpdate] = useState<number>(0)
  const [progress, setProgress] = useState<number>(0)

  const selectedFieldLabels = useMemo(
    () => BULK_UPDATE_FIELDS.filter((field) => selectedFields.includes(field.id)).map((field) => field.label),
    [selectedFields],
  )

  useEffect(() => {
    if (!open) {
      setStep('chooseFields')
      setFileName('')
      setRowsToUpdate(0)
      setProgress(0)
    }
  }, [open])

  useEffect(() => {
    if (step !== 'updating') return

    setProgress(8)
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 14, 100)
        if (next >= 100) {
          window.clearInterval(timer)
          window.setTimeout(() => setStep('done'), 350)
        }
        return next
      })
    }, 450)

    return () => window.clearInterval(timer)
  }, [step])

  const toggleField = (fieldId: BulkUpdateFieldId) => {
    setSelectedFields((current) => (
      current.includes(fieldId)
        ? current.filter((id) => id !== fieldId)
        : [...current, fieldId]
    ))
  }

  const downloadTemplate = () => {
    const headers = ['資料 ID', ...selectedFieldLabels]
    const exampleRow = ['CUST-1001', ...selectedFieldLabels.map((label) => `請填入${label}`)]
    const worksheet = [headers, exampleRow]
      .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
      .join('')
    const blob = new Blob([
      `<html><head><meta charset="UTF-8" /></head><body><table>${worksheet}</table></body></html>`,
    ], { type: 'application/vnd.ms-excel;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `bulk-update-template-${selectedFields.join('-')}.xls`
    anchor.click()
    URL.revokeObjectURL(url)
    setStep('uploadTemplate')
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const text = await file.text()
    setFileName(file.name)
    setRowsToUpdate(parseTemplateRows(text).length || 12)
    setStep('confirm')
  }

  const canDownloadTemplate = selectedFields.length > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth={760} autoHeight>
        <DialogHeader>
          <DialogTitle>批次更新資料</DialogTitle>
          <DialogDescription>
            先選擇要更新的欄位並下載 Excel 範本，填好資料後再上傳，系統會解析筆數並在確認後更新資料庫。
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-5">
          <div className="grid grid-cols-4 gap-2 text-caption text-fg-secondary">
            {['選欄位', '下載/上傳', '確認筆數', '背景更新'].map((label, index) => (
              <div key={label} className="rounded-md border border-border bg-surface p-2">
                <div className="text-foreground font-medium">{index + 1}. {label}</div>
              </div>
            ))}
          </div>

          <section className="space-y-3">
            <div>
              <h2 className="text-body-lg font-medium">1. 選擇本次要更新的欄位</h2>
              <p className="text-body text-fg-secondary">範本只會包含已勾選欄位，避免使用者誤改不相關資料。</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {BULK_UPDATE_FIELDS.map((field) => (
                <div key={field.id} className="rounded-lg border border-border bg-surface p-3">
                  <Checkbox
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                    label={field.label}
                    description={field.hint}
                  />
                </div>
              ))}
            </div>
            <Button variant="secondary" size="md" startIcon={Download} onClick={downloadTemplate} disabled={!canDownloadTemplate}>
              下載 Excel 範本
            </Button>
          </section>

          <section className="space-y-3 rounded-lg border border-border bg-surface p-4">
            <div>
              <h2 className="text-body-lg font-medium">2. 上傳已填寫的範本</h2>
              <p className="text-body text-fg-secondary">支援範本另存為 Excel/CSV 後上傳；上傳後會先解析筆數，不會立即寫入資料庫。</p>
            </div>
            <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-dashed border-border bg-surface-raised p-4">
              <span className="min-w-0">
                <span className="block text-body font-medium">{fileName || '選擇要上傳的範本檔案'}</span>
                <span className="block text-caption text-fg-secondary">{rowsToUpdate > 0 ? `已解析 ${rowsToUpdate} 筆待更新資料` : '請先下載範本並填入資料'}</span>
              </span>
              <Button asChild variant="secondary" size="md" startIcon={Upload}>
                <span>上傳範本</span>
              </Button>
              <input className="sr-only" type="file" accept=".csv,.xls,.xlsx,text/csv" onChange={handleFileChange} />
            </label>
          </section>

          {step === 'confirm' && (
            <section className="rounded-lg border border-border bg-surface p-4">
              <h2 className="text-body-lg font-medium">3. 確認更新</h2>
              <p className="text-body text-fg-secondary">系統已解析出 {rowsToUpdate} 筆資料，將更新欄位：{selectedFieldLabels.join('、')}。</p>
            </section>
          )}

          {(step === 'updating' || step === 'done') && (
            <section className="space-y-3 rounded-lg border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-body-lg font-medium">4. 更新進度</h2>
                  <p className="text-body text-fg-secondary">更新會在背景執行，完成後系統會寄信通知，使用者可離開此視窗。</p>
                </div>
                {step === 'done' && <MailCheck className="text-success" size={20} aria-hidden />}
              </div>
              <ProgressBar value={progress} status={step === 'done' ? 'success' : 'inProgress'} affix="value" />
            </section>
          )}
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="md" onClick={() => onOpenChange(false)}>關閉</Button>
          <Button variant="primary" size="md" disabled={step !== 'confirm'} onClick={() => setStep('updating')}>
            下一步，正式更新
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DashboardPage() {
  return (
    <div className="px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] space-y-6">
      <section>
        <h2 className="text-h5 mb-2">Today</h2>
        <p className="text-body text-fg-secondary">
          替換為真實業務 — 訂單 / 收入 / 待處理任務等 dashboard widgets。Consume DS components
          (DataTable / Chart / Card / Stat 等),never modify DS source。
        </p>
      </section>
      <section className="grid grid-cols-3 gap-4">
        {['Revenue', 'Active customers', 'Pending orders'].map((label) => (
          <div key={label} className="rounded-lg border border-divider bg-surface p-4">
            <div className="text-caption text-fg-secondary">{label}</div>
            <div className="text-h3 mt-1">—</div>
          </div>
        ))}
      </section>
    </div>
  )
}

export default function App() {
  const [activeId, setActiveId] = useState<string>('dashboard')
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false)
  const current = NAV.find((n) => n.id === activeId) ?? NAV[0]
  // TooltipProvider self-wrap(Storybook story render 跳過 main.tsx → App 必自帶 TooltipProvider context)
  return (
    <TooltipProvider delayDuration={500} skipDelayDuration={300}>
      <SidebarProvider activeId={activeId} onActiveChange={setActiveId}>
        <AppShell
          layout="primary-sidebar"
          sidebar={<AppSidebar />}
          header={
            <PageHeader
              title={current.label}
              rightSlot={<Button variant="primary" size="md" onClick={() => setBulkUpdateOpen(true)}>批次更新</Button>}
            />
          }
        >
          <DashboardPage />
          <BulkUpdateDialog open={bulkUpdateOpen} onOpenChange={setBulkUpdateOpen} />
        </AppShell>
      </SidebarProvider>
    </TooltipProvider>
  )
}
