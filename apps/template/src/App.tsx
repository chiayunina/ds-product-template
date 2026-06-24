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

import { useCallback, useEffect, useMemo, useState, type ReactElement } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
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
  DataTable,
  type DataTableSelection,
  BulkActionBar,
  Tag,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
  SheetFooter,
  SheetClose,
  Field,
  FieldLabel,
  FieldGroup,
  Input,
  Select,
  Toaster,
  toast,
} from '@qijenchen/design-system'
import { LayoutDashboard, Users, Settings, FileText, BarChart3, Download, Upload, MailCheck, Plus, Trash2, Eye } from 'lucide-react'

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
        {/* @layout-space-magic-ok: gap-2 = 8px icon+label micro-gap in sidebar brand row — bundled DS sidebar header canonical (not consumer layout spacing) */}
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

function PageHeader({ title, rightSlot }: { title: string; rightSlot?: ReactElement<any, any> }) {
  return (
    <ChromeHeader className="bg-surface">
      <SidebarTrigger />
      <h1 className="text-body-lg font-medium flex-1 truncate">{title}</h1>
      {rightSlot}
    </ChromeHeader>
  )
}

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'

interface OrderItem {
  name: string
  qty: number
  unitPrice: number
}

interface Order {
  id: string
  customer: string
  email: string
  items: OrderItem[]
  status: OrderStatus
  createdAt: string
  note: string
}

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: '待處理',
  processing: '處理中',
  shipped: '已出貨',
  completed: '已完成',
  cancelled: '已取消',
}

const STATUS_TAG_COLOR: Record<OrderStatus, React.ComponentProps<typeof Tag>['color']> = {
  pending: 'yellow',
  processing: 'blue',
  shipped: 'turquoise',
  completed: 'green',
  cancelled: 'neutral',
}

const STATUS_OPTIONS = (Object.keys(STATUS_LABEL) as OrderStatus[]).map((value) => ({
  value,
  label: STATUS_LABEL[value],
}))

function orderTotal(order: Order) {
  return order.items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0)
}

function makeOrder(
  id: string,
  customer: string,
  email: string,
  status: OrderStatus,
  createdAt: string,
  items: OrderItem[],
  note = '',
): Order {
  return { id, customer, email, status, createdAt, items, note }
}

const INITIAL_ORDERS: Order[] = [
  makeOrder('ORD-0001', '王小明', 'ming@example.com', 'completed', '2026-06-01', [
    { name: 'Wireless Headphones', qty: 1, unitPrice: 2490 },
    { name: 'USB-C Hub', qty: 2, unitPrice: 1290 },
  ]),
  makeOrder('ORD-0002', '林美麗', 'mei@example.com', 'processing', '2026-06-05', [
    { name: 'Ergonomic Chair', qty: 1, unitPrice: 8900 },
  ]),
  makeOrder('ORD-0003', 'John Chen', 'john@example.com', 'pending', '2026-06-10', [
    { name: 'Mechanical Keyboard', qty: 1, unitPrice: 3200 },
    { name: 'Mouse Pad XL', qty: 1, unitPrice: 450 },
  ]),
  makeOrder('ORD-0004', '張大衛', 'david@example.com', 'shipped', '2026-06-12', [
    { name: 'Water Bottle', qty: 3, unitPrice: 680 },
  ]),
  makeOrder('ORD-0005', 'Sarah Wu', 'sarah@example.com', 'cancelled', '2026-06-15', [
    { name: 'Green Tea 100 Bags', qty: 2, unitPrice: 350 },
  ], '客戶取消，庫存已歸還'),
  makeOrder('ORD-0006', '李建國', 'jianguo@example.com', 'pending', '2026-06-18', [
    { name: 'Wireless Headphones', qty: 2, unitPrice: 2490 },
    { name: 'USB-C Hub', qty: 1, unitPrice: 1290 },
    { name: 'Ergonomic Chair', qty: 1, unitPrice: 8900 },
  ]),
  makeOrder('ORD-0007', 'Emily Huang', 'emily@example.com', 'processing', '2026-06-20', [
    { name: 'Mechanical Keyboard', qty: 1, unitPrice: 3200 },
  ]),
  makeOrder('ORD-0008', '陳志偉', 'zhiwei@example.com', 'completed', '2026-06-22', [
    { name: 'Water Bottle', qty: 5, unitPrice: 680 },
    { name: 'Green Tea 100 Bags', qty: 3, unitPrice: 350 },
  ]),
]

function OrderDetailSheet({
  order,
  open,
  onOpenChange,
  onStatusChange,
}: {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (id: string, status: OrderStatus) => void
}) {
  if (!order) return null
  const total = orderTotal(order)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex flex-col sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{order.id} — {order.customer}</SheetTitle>
        </SheetHeader>
        <SheetBody className="flex flex-col gap-[var(--layout-space-loose)]">
          <div className="flex items-center gap-[var(--layout-space-tight)]">
            <Tag color={STATUS_TAG_COLOR[order.status]} size="md">{STATUS_LABEL[order.status]}</Tag>
            <span className="text-body text-fg-secondary">{order.createdAt}</span>
          </div>
          <section className="space-y-[var(--layout-space-tight)]">
            <p className="text-body-sm font-medium text-fg-secondary">客戶資訊</p>
            {/* @layout-space-magic-ok: space-y-1 = 4px micro-stack for name+email within card */}
            <div className="rounded-lg border border-border bg-surface p-[var(--layout-space-tight)] space-y-1">
              <p className="text-body font-medium">{order.customer}</p>
              <p className="text-body-sm text-fg-secondary">{order.email}</p>
            </div>
          </section>
          <section className="space-y-[var(--layout-space-tight)]">
            <p className="text-body-sm font-medium text-fg-secondary">訂單項目</p>
            <div className="rounded-lg border border-border bg-surface divide-y divide-divider">
              {order.items.map((item, idx) => (
                // @layout-space-magic-ok: py-2 = 8px item row vertical padding in bordered list
                <div key={idx} className="flex items-center justify-between px-[var(--layout-space-tight)] py-2">
                  <div>
                    <p className="text-body">{item.name}</p>
                    <p className="text-body-sm text-fg-secondary">× {item.qty}</p>
                  </div>
                  <p className="text-body font-medium">${(item.qty * item.unitPrice).toLocaleString()}</p>
                </div>
              ))}
              {/* @layout-space-magic-ok: py-2 = 8px item row vertical padding in bordered list */}
              <div className="flex items-center justify-between px-[var(--layout-space-tight)] py-2 bg-surface-raised">
                <p className="text-body font-medium">總計</p>
                <p className="text-body font-medium">${total.toLocaleString()}</p>
              </div>
            </div>
          </section>
          {order.note && (
            <section className="space-y-[var(--layout-space-tight)]">
              <p className="text-body-sm font-medium text-fg-secondary">備註</p>
              <p className="text-body text-fg-secondary rounded-lg border border-border bg-surface p-[var(--layout-space-tight)]">{order.note}</p>
            </section>
          )}
          <section className="space-y-[var(--layout-space-tight)]">
            <p className="text-body-sm font-medium text-fg-secondary">變更狀態</p>
            <Select
              options={STATUS_OPTIONS}
              value={order.status}
              onChange={(val) => {
                onStatusChange(order.id, val as OrderStatus)
                toast({ variant: 'success', title: `訂單 ${order.id} 狀態已更新為「${STATUS_LABEL[val as OrderStatus]}」` })
              }}
              aria-label="訂單狀態"
            />
          </section>
        </SheetBody>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="secondary" size="md">關閉</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

const EMPTY_FORM = {
  customer: '',
  email: '',
  itemName: '',
  itemQty: '1',
  itemPrice: '',
  note: '',
}

function CreateOrderDialog({
  open,
  onOpenChange,
  onCreated,
  nextId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (order: Order) => void
  nextId: string
}) {
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    if (!open) setForm(EMPTY_FORM)
  }, [open])

  const set = (key: keyof typeof EMPTY_FORM) => (val: string) =>
    setForm((f) => ({ ...f, [key]: val }))

  const canSubmit = form.customer.trim() && form.email.trim() && form.itemName.trim() && Number(form.itemQty) > 0 && Number(form.itemPrice) > 0

  const handleCreate = () => {
    const order = makeOrder(
      nextId,
      form.customer.trim(),
      form.email.trim(),
      'pending',
      new Date().toISOString().slice(0, 10),
      [{ name: form.itemName.trim(), qty: Number(form.itemQty), unitPrice: Number(form.itemPrice) }],
      form.note.trim(),
    )
    onCreated(order)
    onOpenChange(false)
    toast({ variant: 'success', title: `訂單 ${nextId} 已建立` })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth={560} autoHeight>
        <DialogHeader>
          <DialogTitle>建立新訂單</DialogTitle>
          <DialogDescription>填入客戶資訊與商品明細，建立後狀態為「待處理」。</DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4">
          <FieldGroup>
            <Field required>
              <FieldLabel>客戶姓名</FieldLabel>
              <Input placeholder="王小明" value={form.customer} onChange={(e) => set('customer')(e.target.value)} />
            </Field>
            <Field required>
              <FieldLabel>Email</FieldLabel>
              <Input type="email" placeholder="customer@example.com" value={form.email} onChange={(e) => set('email')(e.target.value)} />
            </Field>
          </FieldGroup>
          <p className="text-body-sm font-medium text-fg-secondary">商品明細（至少一項）</p>
          <div className="rounded-lg border border-border bg-surface p-3 space-y-3">
            <FieldGroup>
              <Field required>
                <FieldLabel>商品名稱</FieldLabel>
                <Input placeholder="Wireless Headphones" value={form.itemName} onChange={(e) => set('itemName')(e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field required>
                  <FieldLabel>數量</FieldLabel>
                  <Input type="number" min="1" placeholder="1" value={form.itemQty} onChange={(e) => set('itemQty')(e.target.value)} />
                </Field>
                <Field required>
                  <FieldLabel>單價（元）</FieldLabel>
                  <Input type="number" min="0" placeholder="1000" value={form.itemPrice} onChange={(e) => set('itemPrice')(e.target.value)} />
                </Field>
              </div>
            </FieldGroup>
          </div>
          <Field>
            <FieldLabel>備註</FieldLabel>
            <Input placeholder="特殊說明或處理需求（選填）" value={form.note} onChange={(e) => set('note')(e.target.value)} />
          </Field>
        </DialogBody>
        <DialogFooter>
          <Button variant="secondary" size="md" onClick={() => onOpenChange(false)}>取消</Button>
          <Button variant="primary" size="md" disabled={!canSubmit} onClick={handleCreate}>建立訂單</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

const col = createColumnHelper<Order>()

const ORDER_COLUMNS = [
  col.accessor('id', { header: '訂單編號', meta: { type: 'string', width: 110, minWidth: 90 } }),
  col.accessor('customer', { header: '客戶', meta: { type: 'string', width: 130, minWidth: 80 } }),
  col.accessor('email', { header: 'Email', meta: { type: 'string', width: 200, minWidth: 120 } }),
  col.accessor('items', {
    header: '商品數',
    meta: { type: 'string', width: 80 },
    cell: (ctx) => ctx.getValue().length + ' 項',
  }),
  col.accessor((row) => orderTotal(row), {
    id: 'total',
    header: '金額',
    meta: { type: 'currency', prefix: '$', width: 100 },
  }),
  col.accessor('status', {
    header: '狀態',
    meta: { type: 'string', width: 110 },
    cell: (ctx) => {
      const s = ctx.getValue() as OrderStatus
      return <Tag color={STATUS_TAG_COLOR[s]} size="sm">{STATUS_LABEL[s]}</Tag>
    },
  }),
  col.accessor('createdAt', { header: '建立日期', meta: { type: 'date', width: 110 } }),
]

function OrdersPage({
  orders,
  onCreateOrder,
  onStatusChange,
  onDeleteOrders,
}: {
  orders: Order[]
  onCreateOrder: (order: Order) => void
  onStatusChange: (id: string, status: OrderStatus) => void
  onDeleteOrders: (ids: string[]) => void
}) {
  const [createOpen, setCreateOpen] = useState(false)
  const [detailOrder, setDetailOrder] = useState<Order | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selection, setSelection] = useState<DataTableSelection>({ mode: 'include', ids: [] })

  const selectedIds = useMemo(
    () =>
      selection.mode === 'include'
        ? selection.ids
        : orders.map((o) => o.id).filter((id) => !selection.excluded.includes(id)),
    [selection, orders],
  )

  const nextId = `ORD-${String(orders.length + 1).padStart(4, '0')}`

  const handleViewOrder = useCallback((row: Order) => {
    setDetailOrder(row)
    setDetailOpen(true)
  }, [])

  const handleDeleteSelected = () => {
    onDeleteOrders(selectedIds)
    setSelection({ mode: 'include', ids: [] })
    toast({ variant: 'success', title: `已刪除 ${selectedIds.length} 筆訂單` })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-[var(--layout-space-loose)] py-[var(--layout-space-tight)] flex items-center justify-between gap-3">
        <p className="text-body text-fg-secondary">共 {orders.length} 筆訂單</p>
        <Button variant="primary" size="md" startIcon={Plus} onClick={() => setCreateOpen(true)}>新建訂單</Button>
      </div>
      <BulkActionBar
        selection={selectedIds}
        onClear={() => setSelection({ mode: 'include', ids: [] })}
        actions={
          <Button variant="tertiary" size="md" startIcon={Trash2} onClick={handleDeleteSelected}>刪除所選</Button>
        }
      />
      <div className="flex-1 px-[var(--layout-space-loose)] pb-[var(--layout-space-tight)]">
        <DataTable
          columns={ORDER_COLUMNS}
          data={orders}
          getRowId={(row) => row.id}
          height="auto"
          selection={selection}
          onSelectionChange={setSelection}
          selectable="multi"
          rowActions={(row) => (
            <Button variant="tertiary" size="sm" startIcon={Eye} onClick={() => handleViewOrder(row)}>查看</Button>
          )}
        />
      </div>
      <CreateOrderDialog open={createOpen} onOpenChange={setCreateOpen} onCreated={onCreateOrder} nextId={nextId} />
      <OrderDetailSheet
        order={detailOrder}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStatusChange={(id, status) => {
          onStatusChange(id, status)
          if (detailOrder?.id === id) setDetailOrder((prev) => prev ? { ...prev, status } : prev)
        }}
      />
    </div>
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
  return text.trim().split(/\r?\n/).slice(1).map((line) => line.trim()).filter(Boolean)
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
    if (!open) { setStep('chooseFields'); setFileName(''); setRowsToUpdate(0); setProgress(0) }
  }, [open])

  useEffect(() => {
    if (step !== 'updating') return
    setProgress(8)
    const timer = window.setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 14, 100)
        if (next >= 100) { window.clearInterval(timer); window.setTimeout(() => setStep('done'), 350) }
        return next
      })
    }, 450)
    return () => window.clearInterval(timer)
  }, [step])

  const toggleField = (fieldId: BulkUpdateFieldId) => {
    setSelectedFields((current) => current.includes(fieldId) ? current.filter((id) => id !== fieldId) : [...current, fieldId])
  }

  const downloadTemplate = () => {
    const headers = ['資料 ID', ...selectedFieldLabels]
    const exampleRow = ['CUST-1001', ...selectedFieldLabels.map((label) => `請填入${label}`)]
    const worksheet = [headers, exampleRow].map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')
    const blob = new Blob([`<html><head><meta charset="UTF-8" /></head><body><table>${worksheet}</table></body></html>`], { type: 'application/vnd.ms-excel;charset=utf-8' })
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent maxWidth={760} autoHeight>
        <DialogHeader>
          <DialogTitle>批次更新資料</DialogTitle>
          <DialogDescription>先選擇要更新的欄位並下載 Excel 範本，填好資料後再上傳，系統會解析筆數並在確認後更新資料庫。</DialogDescription>
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
                  <Checkbox checked={selectedFields.includes(field.id)} onCheckedChange={() => toggleField(field.id)} label={field.label} description={field.hint} />
                </div>
              ))}
            </div>
            <Button variant="secondary" size="md" startIcon={Download} onClick={downloadTemplate} disabled={selectedFields.length === 0}>下載 Excel 範本</Button>
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
              <Button asChild variant="secondary" size="md" startIcon={Upload}><span>上傳範本</span></Button>
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
          <Button variant="primary" size="md" disabled={step !== 'confirm'} onClick={() => setStep('updating')}>下一步，正式更新</Button>
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
        <p className="text-body text-fg-secondary">替換為真實業務 — 訂單 / 收入 / 待處理任務等 dashboard widgets。Consume DS components (DataTable / Chart / Card / Stat 等),never modify DS source。</p>
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
  const [activeId, setActiveId] = useState<string>('orders')
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false)
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS)

  const current = NAV.find((n) => n.id === activeId) ?? NAV[0]

  const handleCreateOrder = useCallback((order: Order) => { setOrders((prev) => [...prev, order]) }, [])
  const handleStatusChange = useCallback((id: string, status: OrderStatus) => { setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o)) }, [])
  const handleDeleteOrders = useCallback((ids: string[]) => { setOrders((prev) => prev.filter((o) => !ids.includes(o.id))) }, [])

  const rightSlot = activeId === 'dashboard'
    ? <Button variant="primary" size="md" onClick={() => setBulkUpdateOpen(true)}>批次更新</Button>
    : undefined

  return (
    <TooltipProvider delayDuration={500} skipDelayDuration={300}>
      <SidebarProvider activeId={activeId} onActiveChange={setActiveId}>
        <AppShell layout="primary-sidebar" sidebar={<AppSidebar />} header={<PageHeader title={current.label} rightSlot={rightSlot} />}>
          {activeId === 'dashboard' && <DashboardPage />}
          {activeId === 'orders' && (
            <OrdersPage orders={orders} onCreateOrder={handleCreateOrder} onStatusChange={handleStatusChange} onDeleteOrders={handleDeleteOrders} />
          )}
          {activeId !== 'dashboard' && activeId !== 'orders' && (
            <div className="px-[var(--layout-space-loose)] py-[var(--layout-space-tight)]">
              <p className="text-body text-fg-secondary">此頁面尚未實作。</p>
            </div>
          )}
          <BulkUpdateDialog open={bulkUpdateOpen} onOpenChange={setBulkUpdateOpen} />
        </AppShell>
      </SidebarProvider>
      <Toaster />
    </TooltipProvider>
  )
}
