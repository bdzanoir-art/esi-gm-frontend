import React from 'react';
import Sidebar from '../Components/Sidebar';
import ThemeToggle from '../Components/ThemeToggle';
import '../Style/RequestButtonsGuide.css';
import {
  Info,
  CheckCircle2,
  Clock3,
  ShieldCheck,
  FileText,
  CircleCheckBig,
  CircleX,
  CircleDashed,
  PackageCheck,
  PackageOpen,
  RotateCcw,
  CheckCheck,
  ScanLine,
  Boxes,
  ArrowRight,
  PlayCircle,
  AlertCircle,
  ClipboardCheck,
} from 'lucide-react';

const workflowSections = [
  {
    id: 1,
    title: '1. Pending',
    subtitle: 'Request just submitted - System automatically validates based on stock',
    color: 'yellow',
    icon: <CircleDashed size={18} />,
    actionGroups: [
      {
        badge: 'Automatic Approval',
        badgeColor: 'green',
        icon: <CircleCheckBig size={14} />,
        title: 'System automatically approves if stock is available',
        nextStatus: 'Approved',
        whenClick: [
          'System checks stock availability in real-time',
          'If ALL materials are in stock → Auto-Approved',
          'Request status changes to "Approved"',
          'QR code and validation code generated automatically',
        ],
        useCase: 'Immediately when stock is sufficient for all requested materials',
        example: 'If student requests 2 Arduinos and 3 sensors and all are in stock, it becomes "Approved" instantly.',
      },
      {
        badge: 'Automatic Rejection',
        badgeColor: 'red',
        icon: <CircleX size={14} />,
        title: 'System automatically rejects if stock is insufficient',
        nextStatus: 'Rejected',
        whenClick: [
          'System checks stock availability',
          'If ANY material is out of stock → Auto-Rejected',
          'Student receives rejection notification with reason',
        ],
        useCase: 'Immediately when stock is insufficient for requested materials',
        example: 'If 1 requested sensor is out of stock, the system rejects it "Auto-Rejected".',
      },
    ],
  },
  {
    id: 2,
    title: '2. Approved',
    subtitle: 'Request auto-approved by system, technician needs to prepare materials',
    color: 'blue',
    icon: <CheckCircle2 size={18} />,
    actionGroups: [
      {
        badge: 'Mark Ready',
        badgeColor: 'cyan',
        icon: <PackageCheck size={14} />,
        title: 'Confirm materials are prepared and ready for student pickup',
        nextStatus: 'Ready',
        whenClick: [
          'Request status changes to "Ready"',
          'Technician records condition of EACH material (Excellent, Good, etc.)',
          'Student is notified materials are ready for pickup',
        ],
        useCase: 'After physically gathering and checking all materials',
        example: 'You collected 2 Arduino boards and 3 sensors from storage. You click "Mark Ready" after checking them.',
      },
    ],
  },
  {
    id: 3,
    title: '3. Ready',
    subtitle: 'Materials prepared, waiting for student to collect',
    color: 'cyan',
    icon: <PackageOpen size={18} />,
    actionGroups: [
      {
        badge: 'Confirm Pickup',
        badgeColor: 'purple',
        icon: <ScanLine size={14} />,
        title: 'Student has collected the materials',
        nextStatus: 'Collected',
        whenClick: [
          'Request status changes to "Collected"',
          'Technician verifies condition of materials again',
          'Technician name recorded as "Issued By"',
        ],
        useCase: 'When student arrives and takes materials',
        example: 'Student "Ahmed Benali" arrives. You scan the QR, verify his ID, hand over the items, and click "Confirm Pickup".',
      },
      {
        badge: 'Reject',
        badgeColor: 'red',
        icon: <CircleX size={14} />,
        title: 'Cancel if student never comes',
        nextStatus: 'Rejected',
        whenClick: ['Request cancelled', 'Materials returned to inventory'],
        useCase: "If student doesn't show up or request expired",
        example: 'Student never showed up after 3 days. You reject it to free up the materials.',
      },
    ],
  },
  {
    id: 4,
    title: '4. Collected',
    subtitle: 'Student has taken materials, transition period',
    color: 'purple',
    icon: <ClipboardCheck size={18} />,
    actionGroups: [
      {
        badge: 'In Use',
        badgeColor: 'indigo',
        icon: <Boxes size={14} />,
        title: 'Confirm materials are actively being used by student',
        nextStatus: 'In Use',
        whenClick: [
          'Request status changes to "In Use"',
          'Materials officially tracked as borrowed',
          'Return tracking becomes active',
        ],
        useCase: 'After student confirms they started using materials',
        example: 'Student has the materials and started the work session.',
      },
      {
        badge: 'Confirm Return',
        badgeColor: 'orange',
        icon: <RotateCcw size={14} />,
        title: 'Student returns materials immediately',
        nextStatus: 'Returned',
        whenClick: [
          'Request status changes to "Returned"',
          'Technician checks condition and documents any issues',
        ],
        useCase: 'If student returns materials right away',
        example: 'Student returns materials shortly after pickup.',
      },
    ],
  },
  {
    id: 5,
    title: '5. In Use',
    subtitle: 'Materials currently with student, being used for project',
    color: 'indigo',
    icon: <Boxes size={18} />,
    actionGroups: [
      {
        badge: 'Confirm Return',
        badgeColor: 'orange',
        icon: <RotateCcw size={14} />,
        title: 'Student brings back the materials',
        nextStatus: 'Returned',
        whenClick: [
          'Request status changes to "Returned"',
          'Technician inspects condition carefully (Excellent, Damage, etc.)',
          'Return timestamp recorded',
        ],
        useCase: 'When student returns materials to the lab',
        example: 'Student returns materials. You inspect their condition and click "Confirm Return".',
      },
    ],
  },
  {
    id: 6,
    title: '6. Returned',
    subtitle: 'Materials physically returned, need to be processed',
    color: 'orange',
    icon: <RotateCcw size={18} />,
    actionGroups: [
      {
        badge: 'Complete',
        badgeColor: 'green',
        icon: <CheckCheck size={14} />,
        title: 'Finalize request and return materials to inventory',
        nextStatus: 'Completed',
        whenClick: [
          'Request status changes to "Completed"',
          'Materials added back to inventory stock',
          'Request closed and archived',
        ],
        useCase: 'After inspecting materials and updating inventory',
        example: 'Materials back in storage. Inventory updated. You click "Complete" to close the request.',
      },
      {
        badge: 'In Use',
        badgeColor: 'indigo',
        icon: <Boxes size={14} />,
        title: 'Student needs to re-borrow materials',
        nextStatus: 'In Use',
        whenClick: [
          'Request status goes back to "In Use"',
          'Materials given back to student',
        ],
        useCase: 'If student needs extension',
        example: 'Student returned them but asked to use them for one more session.',
      },
    ],
  },
  {
    id: 7,
    title: '7. Completed',
    subtitle: 'Request finished, materials back in inventory - NO MORE ACTIONS',
    color: 'green',
    icon: <CheckCheck size={18} />,
    final: true,
    finalText: 'Final Status - No actions available. Request workflow is complete.',
  },
  {
    id: 8,
    title: '8. Rejected',
    subtitle: 'Request denied or cancelled - NO MORE ACTIONS',
    color: 'red',
    icon: <CircleX size={18} />,
    final: true,
    finalText: 'Final Status - No actions available. Request workflow is complete.',
  },
];

function StatusCard({ section }) {
  return (
    <section className={`rqg-status-card ${section.color}`}>
      <div className="rqg-status-header">
        <div className="rqg-status-title-wrap">
          <div className={`rqg-status-icon ${section.color}`}>{section.icon}</div>
          <div>
            <h3>{section.title} <ArrowRight size={14} className="rqg-inline-arrow" /></h3>
            <p>{section.subtitle}</p>
          </div>
        </div>
      </div>

      {section.final ? (
        <div className="rqg-final-box">
          <div className="rqg-final-icon"><CheckCircle2 size={24} /></div>
          <p className="font-bold">{section.finalText}</p>
        </div>
      ) : (
        <div className="rqg-actions-wrapper">
          <p className="rqg-actions-count">Available Actions ({section.actionGroups.length}):</p>
          <div className="rqg-action-list">
            {section.actionGroups.map((action, index) => (
              <div key={index} className="rqg-action-card">
                <div className="rqg-action-top">
                  <span className={`rqg-badge ${action.badgeColor}`}>{action.icon} {action.badge}</span>
                  <div className="rqg-action-heading">
                    <h4>{action.title}</h4>
                    <span className="rqg-next-status">➜ Next Status: <strong>{action.nextStatus}</strong></span>
                  </div>
                </div>
                <div className="rqg-action-grid">
                  <div className="rqg-info-box">
                    <h5 className="flex items-center gap-2 text-green-500 font-bold"><CheckCircle2 size={14}/> What Happens When You Click:</h5>
                    <ul>{action.whenClick.map((item, idx) => (<li key={idx}>✅ {item}</li>))}</ul>
                  </div>
                  <div className="rqg-side-column">
                    <div className="rqg-info-box warning">
                      <h5 className="flex items-center gap-2 text-orange-500 font-bold"><Clock3 size={14}/> When To Use This Button:</h5>
                      <p>{action.useCase}</p>
                    </div>
                    <div className="rqg-info-box example">
                      <h5 className="flex items-center gap-2 text-blue-500 font-bold"><Info size={14}/> Example:</h5>
                      <p>{action.example}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default function RequestButtonsGuide() {
  return (
    <div className="rqg-layout">
      <Sidebar />
      <main className="rqg-main">
        <div className="rqg-shell">
          <div className="rqg-topbar">
            <div>
              <h1 className="rqg-title">Workflow Buttons - Complete Guide</h1>
              <p className="rqg-subtitle">Every stage from Pending to Completed explained in detail</p>
            </div>
            <ThemeToggle />
          </div>

          <section className="rqg-hero-box">
            <div className="rqg-hero-title">
              <Info size={18} />
              <span>How it Works</span>
            </div>
            <p>Admin and Storekeeper users see these buttons based on the current status of a request.</p>
          </section>

          {workflowSections.map((s) => <StatusCard key={s.id} section={s} />)}

          {/* Action Modal Details */}
          <section className="rqg-extra-card">
            <div className="rqg-extra-header"><FileText size={20} className="text-blue-500" /><h3>Action Modal Details</h3></div>
            <p className="rqg-extra-text">When clicking action buttons, a <strong>modal window</strong> opens for detail input:</p>
            <div className="rqg-extra-grid">
              <div className="rqg-mini-card blue-soft">
                <p className="font-bold mb-2">📦 For Ready, Collected, Returned, Completed:</p>
                <ul>
                  <li><strong>Material Condition Table:</strong> Set condition for each item.</li>
                  <li><strong>Options:</strong> Excellent, Good, Fair, Damaged, Needs Repair.</li>
                  <li><strong>Previous Condition:</strong> Shows status from previous stage.</li>
                  <li><strong>Notes:</strong> Optional context.</li>
                </ul>
              </div>
              <div className="rqg-mini-card red-soft">
                <p className="font-bold mb-2 text-red-500">❌ For Reject:</p>
                <ul>
                  <li><strong>Notes REQUIRED:</strong> Must explain rejection reason.</li>
                  <li><strong>Examples:</strong> "Stock insufficient", "Duplicate request".</li>
                  <li><strong>Disable Check:</strong> Submit is disabled until notes are entered.</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Who Can See These Buttons */}
          <section className="rqg-extra-card">
            <div className="rqg-extra-header"><ShieldCheck size={20} className="text-purple-500" /><h3>Who Can See These Buttons?</h3></div>
            <div className="rqg-role-grid">
              <div className="rqg-role-card admin">
                <h4 className="flex items-center gap-2">👤 Admin</h4>
                <p>✅ Can see and use <strong>ALL action buttons</strong> for all requests.</p>
              </div>
              <div className="rqg-role-card keeper">
                <h4 className="flex items-center gap-2">🔧 Storekeeper</h4>
                <p>✅ Can see and use <strong>ALL action buttons</strong> for all requests.</p>
              </div>
              <div className="rqg-role-card student">
                <h4 className="flex items-center gap-2 text-red-500">🎓 Student</h4>
                <p>❌ <strong>Cannot see any action buttons</strong>. View-only mode for status/timeline.</p>
              </div>
            </div>
          </section>

          {/* Quick Reference */}
          <section className="rqg-extra-card">
            <div className="rqg-extra-header"><Clock3 size={20} className="text-orange-500" /><h3>Quick Reference - Complete Workflow</h3></div>
            <div className="rqg-code-box">
              <p><strong>Standard Flow:</strong></p>
              <p className="text-sm">
                <span className="rqg-flow yellow">Pending</span> ➜ <span className="rqg-flow blue">Auto-Approved</span> ➜ <span className="rqg-flow cyan">Ready</span> ➜ <span className="rqg-flow purple">Collected</span> ➜ <span className="rqg-flow indigo">In Use</span> ➜ <span className="rqg-flow orange">Returned</span> ➜ <span className="rqg-flow green">Completed</span>
              </p>
              <div className="my-2 border-t border-gray-100 dark:border-gray-800"></div>
              <p><strong>Rejection Flow:</strong></p>
              <p className="text-sm"><span className="rqg-flow yellow">Pending</span> ➜ <span className="rqg-flow red">Auto-Rejected</span> (Stock insufficient)</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
