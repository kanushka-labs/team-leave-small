screen MyLeave "An employee's balance, history and new request action"
  navbar "Team Leave"
  sidebar "My Leave -> MyLeave | New Request -> NewRequest"
  heading "My Leave"
  row
    card "Vacation | 12 days | remaining"
    card "Sick | 6 days | remaining"
    card "Personal | 3 days | remaining"
  row
    heading "My Requests"
    right
    button "New Request" primary -> NewRequest
  table "Dates | Type | Reason | Status"
    row "Oct 10 - Oct 12 | Vacation | Family trip | Pending"
    row "Sep 2 - Sep 2 | Sick | Flu | Approved"
    row "Aug 1 - Aug 3 | Personal | Moving | Rejected"

screen NewRequest "An employee submits a new leave request"
  navbar "Team Leave"
  sidebar "My Leave -> MyLeave | New Request -> NewRequest"
  heading "New Leave Request"
  select "Leave type (Vacation, Sick, Personal)"
  row
    input "Start date"
    input "End date"
  textarea "Reason"
  row
    right
    button "Cancel" -> MyLeave
    button "Submit" primary -> MyLeave

screen TeamQueue "A manager's team pending requests"
  navbar "Team Leave"
  sidebar "Pending Requests -> TeamQueue | Team History -> TeamHistory | Team Balances -> TeamBalances"
  heading "Pending Requests"
  table "Employee | Dates | Type | Reason" -> RequestDetail
    row "Alex Doe | Oct 10 - Oct 12 | Vacation | Family trip"
    row "Sam Lee | Oct 15 - Oct 16 | Sick | Doctor visit"

screen RequestDetail "A manager approves or rejects one request"
  navbar "Team Leave"
  sidebar "Pending Requests -> TeamQueue | Team History -> TeamHistory | Team Balances -> TeamBalances"
  heading "Request from Alex Doe"
  text "Vacation, Oct 10 - Oct 12"
  text "Reason: Family trip"
  textarea "Comment (required to reject)"
  row
    right
    button "Reject" danger -> TeamQueue
    button "Approve" primary -> TeamQueue

screen TeamHistory "A manager's team request history"
  navbar "Team Leave"
  sidebar "Pending Requests -> TeamQueue | Team History -> TeamHistory | Team Balances -> TeamBalances"
  heading "Team History"
  table "Employee | Dates | Type | Status | Comment"
    row "Alex Doe | Sep 2 - Sep 2 | Sick | Approved | "
    row "Sam Lee | Aug 1 - Aug 3 | Personal | Rejected | No coverage available"

screen TeamBalances "A manager sets or adjusts a team member's balances"
  navbar "Team Leave"
  sidebar "Pending Requests -> TeamQueue | Team History -> TeamHistory | Team Balances -> TeamBalances"
  heading "Team Balances"
  table "Employee | Vacation | Sick | Personal" -> AdjustBalance
    row "Alex Doe | 12 | 6 | 3"
    row "Sam Lee | 8 | 10 | 2"

screen AdjustBalance "A manager adjusts one employee's balance for one leave type"
  navbar "Team Leave"
  sidebar "Pending Requests -> TeamQueue | Team History -> TeamHistory | Team Balances -> TeamBalances"
  heading "Adjust Balance — Alex Doe"
  select "Leave type (Vacation, Sick, Personal)"
  input "New balance (days)"
  row
    right
    button "Cancel" -> TeamBalances
    button "Save" primary -> TeamBalances

flow "My leave"
  role "Employee"
  description "An employee checks their balance and history, and submits a new request"
  MyLeave
  NewRequest

flow "Team approvals"
  role "Manager"
  description "A manager reviews pending requests, decides them, and manages team balances"
  TeamQueue
  RequestDetail
  TeamHistory
  TeamBalances
  AdjustBalance
