# Product-wide

Rules that apply to more than one feature.

## Decisions

- Users sign in via SSO through Thunder, the platform identity provider. \[org default\]
- Only two roles exist, Employee and Manager; a manager manages their own team's balances and requests directly, with no separate Admin/HR role.
- Each employee has exactly one manager, set when their account is provisioned; a manager sees and acts on only their own team's balances and requests.

## Open Questions

(none)