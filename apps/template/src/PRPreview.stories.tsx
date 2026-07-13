import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { createColumnHelper } from '@tanstack/react-table'
import { Download } from 'lucide-react'
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
  DataTable,
  DescriptionList,
  DescriptionItem,
  Steps,
  StepItem,
  StepLabel,
  StepDescription,
  FileItem,
  ScrollArea,
  Tag,
  Separator,
  Textarea,
} from '@qijenchen/design-system'
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
} from 'lucide-react'

// ── Nav ────────────────────────────────────────────────────────────────────────────

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'pr', label: 'Purchase Requests', icon: FileText },
  { id: 'vendors', label: 'Vendors', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'settings', label: 'Settings', icon: Settings },
] as const

function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {/* @layout-space-magic-ok: gap-2 = 8px icon+label micro-gap in sidebar brand row — DS sidebar header canonical */}
        <div className="flex items-center gap-2 min-w-0 group-data-[collapsible=icon]:justify-center">
          <Avatar alt="ProcureX" size={24} shape="square" color="blue" solid />
          <span className="text-body-lg font-medium truncate group-data-[collapsible=icon]:hidden">
            ProcureX
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ id, label, icon }) => (
                <SidebarMenuItem key={id}>
                  <SidebarMenuButton id={id} startIcon={icon} tooltip={label} isActive={id === 'pr'}>
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
                <ItemAvatar alt="Linda Wang" color="green" />
                <span data-sidebar="menu-label" className="min-w-0 flex-1 truncate">Linda Wang</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

// ── Status Tag ──────────────────────────────────────────────────────────────────

function StatusTag({ status }: { status: 'pending' | 'approved' | 'current' | 'rejected' }) {
  const map = {
    pending:  { color: 'neutral', label: 'Pending'     },
    approved: { color: 'green',   label: 'Approved'    },
    current:  { color: 'blue',    label: 'In Progress' },
    rejected: { color: 'red',     label: 'Rejected'    },
  } as const
  const { color, label } = map[status]
  return <Tag color={color} size="sm">{label}</Tag>
}

// ── Line item type + columns ────────────────────────────────────────────────────────

interface LineItem {
  no: string
  desc: string
  sub: string
  req: string
  qty: number
  uom: string
  unitPrice: number
  amount: number
  cc: string
}

const col = createColumnHelper<LineItem>()

const LINE_COLUMNS = [
  col.accessor('no', {
    header: 'Item No.',
    meta: { type: 'string', width: 80, minWidth: 70 },
    cell: (ctx) => <span className="font-mono text-caption text-fg-secondary">{ctx.getValue()}</span>,
  }),
  col.accessor('desc', {
    header: 'Short Description',
    meta: { type: 'string', width: 220, minWidth: 160 },
    cell: (ctx) => {
      const row = ctx.row.original
      return (
        <div>
          <div className="text-body font-medium text-foreground">{ctx.getValue()}</div>
          <div className="text-caption text-fg-secondary">{row.sub}</div>
        </div>
      )
    },
  }),
  col.accessor('req', {
    header: 'Requisitioner',
    meta: { type: 'string', width: 120, minWidth: 100 },
  }),
  col.accessor('qty', {
    header: 'Qty',
    meta: { type: 'number', width: 60, minWidth: 50 },
  }),
  col.accessor('uom', {
    header: 'UoM',
    meta: { type: 'string', width: 60, minWidth: 50 },
  }),
  col.accessor('unitPrice', {
    header: 'Unit Price (USD)',
    meta: { type: 'currency', prefix: '', width: 130, minWidth: 110 },
  }),
  col.accessor('amount', {
    header: 'Amount (USD)',
    meta: { type: 'currency', prefix: '', width: 120, minWidth: 100 },
  }),
  col.accessor('cc', {
    header: 'Cost Center',
    meta: { type: 'string', width: 100, minWidth: 80 },
    cell: (ctx) => <Tag color="neutral" size="sm">{ctx.getValue()}</Tag>,
  }),
]

const LINE_ITEMS: LineItem[] = [
  { no: '0010', desc: 'CNC Machining Center, 5-Axis',      sub: 'Haas UMC-1000',           req: 'James Liu',  qty: 2,   uom: 'EA',  unitPrice: 68500, amount: 137000, cc: 'CC-3100' },
  { no: '0020', desc: 'Industrial Robot Arm, 6-DOF',       sub: 'FANUC M-20iD/12',          req: 'James Liu',  qty: 1,   uom: 'EA',  unitPrice: 45000, amount:  45000, cc: 'CC-3100' },
  { no: '0030', desc: 'Servo Drive & Controller Set',      sub: 'Siemens SINAMICS S120',    req: 'Amy Chen',   qty: 4,   uom: 'SET', unitPrice:  8200, amount:  32800, cc: 'CC-3200' },
  { no: '0040', desc: 'Coolant Filtration Unit',           sub: 'Mayfran CF-600',           req: 'Tom Hsu',    qty: 2,   uom: 'EA',  unitPrice:  9250, amount:  18500, cc: 'CC-4010' },
  { no: '0050', desc: 'Cutting Tool Set, Carbide End Mill', sub: 'Sandvik Coromant R390',   req: 'James Liu',  qty: 200, uom: 'PCS', unitPrice:   125, amount:  25000, cc: 'CC-3100' },
  { no: '0060', desc: 'Safety Enclosure & Light Curtain',  sub: 'SICK deTec4',              req: 'Amy Chen',   qty: 3,   uom: 'SET', unitPrice:  2650, amount:   7950, cc: 'CC-4010' },
  { no: '0070', desc: 'Installation & Commissioning',      sub: 'On-site 10-day support',   req: 'Linda Wang', qty: 1,   uom: 'LS',  unitPrice: 18500, amount:  18500, cc: 'CC-3100' },
]

// ── PR Preview Page ───────────────────────────────────────────────────────────────

const STATIONS = [
  { value: 's1', label: 'Dept. Head',         name: 'Michael Zhao',    role: 'Head of Mfg. Engineering',        status: 'approved' as const, date: '2026-07-14 09:22' },
  { value: 's2', label: 'Cost Center Ctrl.',  name: 'Sandy Liao',      role: 'Finance Controller · MFG-TW',     status: 'approved' as const, date: '2026-07-14 11:05' },
  { value: 's3', label: 'Procurement Lead',   name: 'Kevin Park',      role: 'Sr. Procurement Manager',          status: 'current'  as const, date: undefined },
  { value: 's4', label: 'Vendor Evaluation',  name: 'Eva Tsai',        role: 'Sourcing Analyst',                 status: 'pending'  as const, date: undefined },
  { value: 's5', label: 'Legal Review',       name: 'Peter Ho',        role: 'Legal Counsel',                   status: 'pending'  as const, date: undefined },
  { value: 's6', label: 'IT Asset',           name: 'IT Asset Team',   role: 'IT Infrastructure · Regional',    status: 'pending'  as const, date: undefined },
  { value: 's7', label: 'Safety & EHS',       name: 'Grace Wu',        role: 'EHS Manager · MFG-TW',            status: 'pending'  as const, date: undefined },
  { value: 's8', label: 'Finance Director',   name: 'Richard Lin',     role: 'Finance Director APAC',            status: 'pending'  as const, date: undefined },
  { value: 's9', label: 'VP Operations',      name: 'Catherine Huang', role: 'VP of Operations & Supply Chain', status: 'pending'  as const, date: undefined },
]

function PRPreviewPage() {
  const completedValues = STATIONS.filter(s => s.status === 'approved').map(s => s.value)
  const currentValue = STATIONS.find(s => s.status === 'current')?.value ?? 's3'

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Page header ── */}
      <ChromeHeader className="bg-surface shrink-0">
        <SidebarTrigger />
        <div className="flex items-center gap-[var(--layout-space-tight)] flex-1 min-w-0">
          <span className="text-body text-fg-secondary">Purchase Requests</span>
          <span className="text-fg-muted">/</span>
          <span className="text-body font-medium truncate">PR-2026-04817</span>
          <Tag color="yellow" size="sm">Draft</Tag>
        </div>
        <div className="flex items-center gap-[var(--layout-space-tight)]">
          <Button variant="secondary" size="md">Back to Edit</Button>
          <Button variant="primary" size="md">Confirm & Submit</Button>
        </div>
      </ChromeHeader>

      {/* ── Scrollable body ── */}
      <ScrollArea className="flex-1">
        <div className="px-[var(--layout-space-loose)] py-[var(--layout-space-loose)] flex flex-col gap-[var(--layout-space-loose)] max-w-4xl mx-auto">

          {/* Wizard progress Steps — horizontal, 3 steps */}
          <Steps
            value="preview"
            completedValues={['info', 'items']}
            orientation="horizontal"
          >
            <StepItem value="info"><StepLabel>Basic Info</StepLabel></StepItem>
            <StepItem value="items"><StepLabel>Line Items</StepLabel></StepItem>
            <StepItem value="preview"><StepLabel>Preview & Submit</StepLabel></StepItem>
          </Steps>

          <Separator />

          {/* ── 1. Basic Information ── */}
          <section className="flex flex-col gap-[var(--layout-space-tight)]">
            <p className="text-body-lg font-semibold text-foreground">PR Basic Information</p>
            <div className="border border-border rounded-lg p-[var(--layout-space-tight)]">
              <DescriptionList cols={3}>
                <DescriptionItem label="PR Number">PR-2026-04817</DescriptionItem>
                <DescriptionItem label="PR Type">
                  <Tag color="blue" size="sm">Capital Expenditure</Tag>
                </DescriptionItem>
                <DescriptionItem label="Status">
                  <Tag color="yellow" size="sm">Draft</Tag>
                </DescriptionItem>
                <DescriptionItem label="Company / Entity">ACME Manufacturing TW Ltd.</DescriptionItem>
                <DescriptionItem label="Total Amount">
                  <span className="font-semibold text-foreground">USD 284,750.00</span>
                </DescriptionItem>
                <DescriptionItem label="Create Date">2026-07-13</DescriptionItem>
                <DescriptionItem label="Creator (開單者)">
                  <div className="flex items-center gap-[var(--layout-space-tight)]">
                    <ItemAvatar alt="Linda Wang" color="green" />
                    <div>
                      <div className="text-body font-medium text-foreground">Linda Wang</div>
                      <div className="text-caption text-fg-secondary">Procurement Specialist · MFG-TW</div>
                    </div>
                  </div>
                </DescriptionItem>
                <DescriptionItem label="Department">Manufacturing Engineering</DescriptionItem>
                <DescriptionItem label="Project Code">MFG-2026-L7</DescriptionItem>
              </DescriptionList>
            </div>
          </section>

          {/* ── 2. Line Items (DataTable) ── */}
          <section className="flex flex-col gap-[var(--layout-space-tight)]">
            <div className="flex items-center justify-between">
              <p className="text-body-lg font-semibold text-foreground">Line Items</p>
              <Tag color="neutral" size="sm">7 items</Tag>
            </div>
            <DataTable
              columns={LINE_COLUMNS}
              data={LINE_ITEMS}
              getRowId={(row) => row.no}
              height="auto"
            />
          </section>

          {/* ── 3. Approval Route (Steps, vertical, scrollable) ── */}
          <section className="flex flex-col gap-[var(--layout-space-tight)]">
            <div className="flex items-center justify-between">
              <p className="text-body-lg font-semibold text-foreground">Approval Route</p>
              <Tag color="neutral" size="sm">9 stations</Tag>
            </div>
            <div className="border border-border rounded-lg p-[var(--layout-space-tight)]">
              <ScrollArea style={{ maxHeight: 440 }}>
                <Steps value={currentValue} completedValues={completedValues} linear={false}>
                  {STATIONS.map((s) => (
                    <StepItem key={s.value} value={s.value}>
                      <StepLabel>{s.label}</StepLabel>
                      <StepDescription>
                        <span className="font-medium text-foreground">{s.name}</span>
                        {' · '}
                        <span>{s.role}</span>
                        {'  '}
                        <StatusTag status={s.status} />
                        {s.date && (
                          // @layout-space-magic-ok: ml-1 = 4px inline date nudge after Tag — inline text rhythm, not consumer layout spacing
                          <span className="ml-1 text-caption text-fg-secondary">{s.date}</span>
                        )}
                      </StepDescription>
                    </StepItem>
                  ))}
                </Steps>
              </ScrollArea>
            </div>
          </section>

          {/* ── 4. Attachments ── */}
          <section className="flex flex-col gap-[var(--layout-space-tight)]">
            <div className="flex items-center justify-between">
              <p className="text-body-lg font-semibold text-foreground">Attachments</p>
              <Tag color="neutral" size="sm">5 files</Tag>
            </div>
            {/* @layout-space-magic-ok: gap-2 = 8px between FileItem rows — FileItem list canonical gap per file-item.stories.tsx compact list `gap-1`/`gap-2` DS pattern, not consumer layout spacing */}
            <div className="flex flex-col gap-2">
              {[
                { name: 'RFQ_Haas_UMC1000_Quotation_v3.pdf',      desc: 'Uploaded by Linda Wang · 2026-07-12 · 2.4 MB' },
                { name: 'CapEx_Budget_Comparison_2026Q3.xlsx',     desc: 'Uploaded by Sandy Liao · 2026-07-12 · 890 KB' },
                { name: 'FANUC_M20iD_Technical_Spec.pdf',          desc: 'Uploaded by James Liu · 2026-07-11 · 5.1 MB' },
                { name: 'Investment_Justification_CapEx2026.docx', desc: 'Uploaded by Linda Wang · 2026-07-13 · 340 KB' },
                { name: 'Factory_Layout_ProposedInstallation.jpg', desc: 'Uploaded by James Liu · 2026-07-10 · 1.8 MB' },
              ].map((f) => (
                <FileItem
                  key={f.name}
                  mode="compact"
                  name={f.name}
                  status="completed"
                  description={f.desc}
                  onDownload={() => {}}
                  actions={
                    <Button size="xs" iconOnly variant="text" startIcon={Download} aria-label="下載" onClick={() => {}} />
                  }
                />
              ))}
            </div>
          </section>

          {/* ── 5. Supporting Information ── */}
          <section className="flex flex-col gap-[var(--layout-space-tight)]">
            <p className="text-body-lg font-semibold text-foreground">Supporting Information</p>
            <div className="border border-border rounded-lg p-[var(--layout-space-tight)] flex flex-col gap-[var(--layout-space-tight)]">
              <div>
                {/* @layout-space-magic-ok: mb-1 = 4px label-to-content micro-gap — typography rhythm between caption label and body text, not consumer layout spacing */}
                <p className="text-caption font-semibold text-fg-secondary uppercase tracking-wide mb-1">Background & Justification</p>
                <p className="text-body text-fg-secondary">
                  This PR supports the{' '}
                  <strong className="text-foreground">Line 7 Capacity Expansion Project (MFG-2026-L7)</strong>{' '}
                  approved by the Board in Q1 2026. Current CNC utilization is at 94%, causing a 6.2-day average order fulfillment delay. The two new machining centers are projected to cut cycle time by 38% and increase monthly capacity by 22%.
                </p>
              </div>
              <Separator />
              <div>
                {/* @layout-space-magic-ok: mb-1 = 4px label-to-content micro-gap — typography rhythm, not consumer layout spacing */}
                <p className="text-caption font-semibold text-fg-secondary uppercase tracking-wide mb-1">Vendor Selection</p>
                <p className="text-body text-fg-secondary">
                  Three vendors evaluated (Haas, DMG Mori, Mazak).{' '}
                  <strong className="text-foreground">Haas UMC-1000 selected</strong> for lowest 7-year TCO, existing on-site spare parts compatibility, and 14-week lead time vs. 22-week competitor average.
                </p>
              </div>
              <Separator />
              <div>
                {/* @layout-space-magic-ok: mb-1 = 4px label-to-content micro-gap — typography rhythm, not consumer layout spacing */}
                <p className="text-caption font-semibold text-fg-secondary uppercase tracking-wide mb-1">Additional Notes</p>
                <Textarea
                  readOnly
                  value="Installation window: 2026-09-15 to 2026-09-26 (planned maintenance shutdown). Commissioning + operator training on final 3 days. Budget contingency of 5% (USD 14,238) pre-approved as part of Capital Budget reserve. Order must be placed before 2026-07-31 to secure Q3 delivery."
                  className="resize-none bg-muted"
                  rows={4}
                />
              </div>
            </div>
          </section>

          {/* ── Bottom actions ── */}
          <div className="flex items-center justify-between py-[var(--layout-space-tight)]">
            <p className="text-caption text-fg-secondary">
              Submitting as <strong className="text-foreground">Linda Wang</strong> · PR-2026-04817 enters the approval queue immediately.
            </p>
            <div className="flex gap-[var(--layout-space-tight)]">
              <Button variant="secondary" size="md">Save as Draft</Button>
              <Button variant="secondary" size="md">← Back to Edit</Button>
              <Button variant="primary" size="md">Confirm & Submit PR</Button>
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  )
}

// ── Story ─────────────────────────────────────────────────────────────────────────────

const meta: Meta = {
  title: 'Apps/template/PR Preview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'PR 開單流程最後預覽步驟 — Basic Info / Line Items / Approval Route / Attachments / Supporting Info。\n' +
          '使用 DS DescriptionList、Steps、DataTable、FileItem、ScrollArea、Tag 等元件。',
      },
    },
  },
}
export default meta
type Story = StoryObj

export const Default: Story = {
  name: 'PR Preview & Submit',
  render: () => (
    <TooltipProvider delayDuration={500} skipDelayDuration={300}>
      <SidebarProvider activeId="pr">
        <AppShell
          layout="primary-sidebar"
          sidebar={<AppSidebar />}
          header={<></>}
        >
          <PRPreviewPage />
        </AppShell>
      </SidebarProvider>
    </TooltipProvider>
  ),
}
