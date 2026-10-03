# Domain model

Team Leave tracks employees, the leave requests they submit, and their
per-type leave balances. A manager is simply the employee a given employee's
`managerId` points to.

```mermaid
erDiagram
    EMPLOYEE ||--o{ LEAVE_REQUEST : submits
    EMPLOYEE ||--o{ LEAVE_BALANCE : has
    EMPLOYEE ||--o{ EMPLOYEE : manages

    EMPLOYEE {
        string id
        string name
        string email
        string managerId
        string role
    }
    LEAVE_REQUEST {
        string id
        string employeeId
        string type
        date startDate
        date endDate
        string reason
        string status
        string comment
        string decidedBy
        datetime decidedAt
    }
    LEAVE_BALANCE {
        string employeeId
        string type
        number balance
    }
```

- `LEAVE_REQUEST.type` and `LEAVE_BALANCE.type` are one of Vacation, Sick or
Personal.
- `LEAVE_REQUEST.status` is one of pending, approved or rejected; `comment` is
required when rejected.
- A `LEAVE_BALANCE` row's `balance` is deducted only when its request is
approved.