Feature: F2 Approvals

  @story-F2.1
  Rule: A manager sees their team's pending leave requests in one list, oldest first

    Scenario: Two pending requests ordered oldest first
      Given Dinesh the manager's team has a Vacation request submitted on "2026-10-01" and a Sick request submitted on "2026-10-03", both pending
      When Dinesh views his team's pending requests
      Then the Vacation request appears before the Sick request

  @story-F2.2
  Rule: A manager approves a pending request

    Scenario: Approving a pending request
      Given Priya the employee has a pending Vacation request
      When Dinesh her manager approves that request
      Then the request's status is "approved"

  @story-F2.3
  Rule: A manager rejects a pending request with a comment explaining why

    Scenario: Rejecting a pending request with a reason
      Given Priya the employee has a pending Vacation request
      When Dinesh her manager rejects that request with the comment "No coverage available"
      Then the request's status is "rejected" with the comment "No coverage available"

    @negative
    Scenario: A rejection without a comment is refused
      Given Priya the employee has a pending Vacation request
      When Dinesh her manager tries to reject that request without a comment
      Then the request is still "pending"

  @story-F2.3 @story-F2.2
  Rule: A decision, once made, is final

    @negative
    Scenario: An approved request cannot be rejected afterwards
      Given Priya the employee has an approved Vacation request
      When Dinesh her manager tries to reject that request
      Then the request is still "approved"

  @story-F2.4
  Rule: A manager sees their team's leave request history, including past approvals and rejections

    Scenario: Viewing a mix of approved and rejected requests
      Given Dinesh the manager's team has an approved Sick request and a rejected Personal request
      When Dinesh views his team's history
      Then he sees both requests, one marked "approved" and the other marked "rejected"

  @story-F2.1
  Rule: A manager sees and decides only their own team's requests

    @negative
    Scenario: A manager cannot see another manager's team requests
      Given Priya the employee reports to Dinesh, not to Farah
      When Farah views her team's pending requests
      Then Priya's request does not appear in Farah's list
