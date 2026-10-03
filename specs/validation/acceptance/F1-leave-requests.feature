Feature: F1 Leave requests

  @story-F1.1
  Rule: An employee submits a leave request with a start date, end date, type and reason

    Scenario: Submitting a vacation request
      Given Priya the employee has a Vacation balance of 12 days
      When Priya submits a leave request for Vacation from "2026-11-02" to "2026-11-04" with reason "Family trip"
      Then the request appears in Priya's request history with status "pending"

  @story-F1.2
  Rule: An employee sees their current balance for each leave type

    Scenario: Viewing balances across all three types
      Given Priya the employee has a Vacation balance of 12 days, a Sick balance of 6 days, and a Personal balance of 3 days
      When Priya views her leave balances
      Then she sees 12 Vacation days, 6 Sick days, and 3 Personal days

  @story-F1.3
  Rule: An employee sees the history of their own past requests, each with its status

    Scenario: Viewing a mix of decided and pending requests
      Given Priya the employee has a pending Vacation request and an approved Sick request
      When Priya views her request history
      Then she sees both requests, one marked "pending" and the other marked "approved"

  @story-F1.4
  Rule: An employee can cancel a request only while it is still pending

    Scenario: Cancelling a pending request
      Given Priya the employee has a pending Vacation request
      When Priya cancels that request
      Then it no longer appears among her pending requests

    @negative
    Scenario: A decided request cannot be cancelled
      Given Priya the employee has an approved Vacation request
      When Priya tries to cancel that request
      Then the request is still approved

  @story-F1.5
  Rule: A manager sets or adjusts a team member's leave balance for each leave type

    Scenario: Increasing a team member's Sick balance
      Given Priya the employee has a Sick balance of 6 days
      When Dinesh her manager sets her Sick balance to 8 days
      Then Priya's Sick balance is 8 days

  @story-F1.2
  Rule: Approving a request deducts the balance; a pending or rejected request leaves it unchanged

    Scenario: Approval deducts the leave balance
      Given Priya the employee has a Vacation balance of 12 days and a pending Vacation request for 2 days
      When Dinesh her manager approves that request
      Then Priya's Vacation balance is 10 days

    Scenario: Rejection leaves the leave balance unchanged
      Given Priya the employee has a Vacation balance of 12 days and a pending Vacation request for 2 days
      When Dinesh her manager rejects that request with a comment
      Then Priya's Vacation balance is still 12 days
