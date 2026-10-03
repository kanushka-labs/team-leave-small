# Leave requests

## Purpose

Employees submit leave requests with dates, type and reason, and view their
current leave balance and the history of their past requests.

## User Stories

- F1.1 As an employee, I submit a leave request with a start date, an end date, a leave type, and a reason.
- F1.2 As an employee, I view my current leave balance for each leave type.
- F1.3 As an employee, I view the history of my past leave requests, each with its status (pending, approved or rejected).
- F1.4 As an employee, I cancel a leave request while it is still pending.
- F1.5 As a manager, I set or adjust a team member's leave balance for each leave type.

## Decisions

- Leave types are Vacation, Sick and Personal.
- A leave balance is deducted only when a request is approved; a pending or rejected request leaves it unchanged.
- An employee can cancel a request only while it is still pending; once a manager has decided, the employee can no longer cancel it.
- A manager sets and adjusts their team members' balances directly (see [Product-wide](../product-wide.md)); there is no separate Admin/HR role.