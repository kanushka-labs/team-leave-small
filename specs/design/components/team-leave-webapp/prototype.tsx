import { useState } from "react";
import {
  Alert,
  Button,
  Detail,
  EmptyState,
  Field,
  Form,
  Heading,
  Navigation,
  Screen,
  Stack,
  Stat,
  Table,
  ValidationSummary,
  defineApp,
  useCollection,
  useDisplayState,
  useNav,
  useParams,
} from "@wso2/prototype-kit";

interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "Vacation" | "Sick" | "Personal";
  startDate: string;
  endDate: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  comment?: string;
}

interface LeaveBalance {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "Vacation" | "Sick" | "Personal";
  balance: number;
}

const leaveRequests: LeaveRequest[] = [
  { id: "req-1001", employeeId: "emp-priya", employeeName: "Priya Nair", type: "Vacation", startDate: "2026-11-02", endDate: "2026-11-04", reason: "Family trip", status: "pending" },
  { id: "req-1002", employeeId: "emp-priya", employeeName: "Priya Nair", type: "Sick", startDate: "2026-09-02", endDate: "2026-09-02", reason: "Flu", status: "approved" },
  { id: "req-1003", employeeId: "emp-priya", employeeName: "Priya Nair", type: "Personal", startDate: "2026-08-01", endDate: "2026-08-03", reason: "Moving", status: "rejected", comment: "No coverage available" },
  { id: "req-2001", employeeId: "emp-alex", employeeName: "Alex Doe", type: "Vacation", startDate: "2026-10-10", endDate: "2026-10-12", reason: "Family trip", status: "pending" },
  { id: "req-2002", employeeId: "emp-sam", employeeName: "Sam Lee", type: "Sick", startDate: "2026-10-15", endDate: "2026-10-16", reason: "Doctor visit", status: "pending" },
  { id: "req-2003", employeeId: "emp-alex", employeeName: "Alex Doe", type: "Sick", startDate: "2026-09-02", endDate: "2026-09-02", reason: "Flu", status: "approved" },
  { id: "req-2004", employeeId: "emp-sam", employeeName: "Sam Lee", type: "Personal", startDate: "2026-08-01", endDate: "2026-08-03", reason: "Moving", status: "rejected", comment: "No coverage available" },
];

const balances: LeaveBalance[] = [
  { id: "bal-priya-vacation", employeeId: "emp-priya", employeeName: "Priya Nair", type: "Vacation", balance: 12 },
  { id: "bal-priya-sick", employeeId: "emp-priya", employeeName: "Priya Nair", type: "Sick", balance: 6 },
  { id: "bal-priya-personal", employeeId: "emp-priya", employeeName: "Priya Nair", type: "Personal", balance: 3 },
  { id: "bal-alex-vacation", employeeId: "emp-alex", employeeName: "Alex Doe", type: "Vacation", balance: 12 },
  { id: "bal-alex-sick", employeeId: "emp-alex", employeeName: "Alex Doe", type: "Sick", balance: 6 },
  { id: "bal-alex-personal", employeeId: "emp-alex", employeeName: "Alex Doe", type: "Personal", balance: 3 },
  { id: "bal-sam-vacation", employeeId: "emp-sam", employeeName: "Sam Lee", type: "Vacation", balance: 8 },
  { id: "bal-sam-sick", employeeId: "emp-sam", employeeName: "Sam Lee", type: "Sick", balance: 10 },
  { id: "bal-sam-personal", employeeId: "emp-sam", employeeName: "Sam Lee", type: "Personal", balance: 2 },
];

const CURRENT_EMPLOYEE_ID = "emp-priya";
const CURRENT_EMPLOYEE_NAME = "Priya Nair";

const nav = (
  <Navigation
    id="nav.main"
    layout="side"
    items={[
      { id: "nav.my-leave", label: "My Leave", to: "screen.my-leave" },
      { id: "nav.new-request", label: "New Request", to: "screen.new-request" },
      { id: "nav.team-queue", label: "Pending Requests", to: "screen.team-queue" },
      { id: "nav.team-history", label: "Team History", to: "screen.team-history" },
      { id: "nav.team-balances", label: "Team Balances", to: "screen.team-balances" },
    ]}
  />
);

function toneForStatus(status: LeaveRequest["status"]) {
  if (status === "pending") return "warning" as const;
  if (status === "approved") return "success" as const;
  return "error" as const;
}

function MyLeave() {
  const state = useDisplayState();
  const requestsCol = useCollection<LeaveRequest>("leaveRequests");
  const balancesCol = useCollection<LeaveBalance>("balances");

  const myBalances = balancesCol.items.filter((b) => b.employeeId === CURRENT_EMPLOYEE_ID);
  const myRequests = state === "state.empty"
    ? []
    : requestsCol.items.filter((r) => r.employeeId === CURRENT_EMPLOYEE_ID);

  return (
    <Screen nav={nav}>
      <Heading id="heading.my-leave" text="My Leave" />
      {state === "state.failed" && (
        <Alert id="alert.my-leave-failed" tone="error" title="Could not load your leave data" text="Try again in a few minutes." />
      )}
      <Stack direction="row">
        {myBalances.map((b) => (
          <Stat key={b.id} id={`stat.balance.${b.id}`} label={b.type} value={`${b.balance} days`} />
        ))}
      </Stack>
      <Heading
        id="heading.my-requests"
        text="My Requests"
        level="section"
        actions={<Button id="btn.new-request" label="New Request" emphasis="primary" to="screen.new-request" />}
      />
      <Table
        id="table.my-requests"
        columns={["Dates", "Type", "Reason", "Status"]}
        rows={myRequests.map((r) => ({
          id: `row.my-request.${r.id}`,
          cells: [`${r.startDate} - ${r.endDate}`, r.type, r.reason, r.status],
          tone: toneForStatus(r.status),
        }))}
        empty={<EmptyState id="empty.my-requests" title="No leave requests yet" text="Your submitted requests appear here." />}
      />
    </Screen>
  );
}

function NewRequestScreen() {
  const state = useDisplayState();
  const nav_ = useNav();
  const requestsCol = useCollection<LeaveRequest>("leaveRequests");

  const handleSubmit = (values: Record<string, string>) => {
    requestsCol.create({
      employeeId: CURRENT_EMPLOYEE_ID,
      employeeName: CURRENT_EMPLOYEE_NAME,
      type: values.type as LeaveRequest["type"],
      startDate: values.startDate,
      endDate: values.endDate,
      reason: values.reason,
      status: "pending",
    });
    nav_.go("screen.my-leave");
  };

  return (
    <Screen nav={nav}>
      <Heading id="heading.new-request" text="New Leave Request" />
      {state === "state.validation-error" && (
        <ValidationSummary
          id="validation.new-request"
          issues={["Choose a leave type", "Give a reason for the request"]}
        />
      )}
      <Form
        id="form.new-request"
        onSubmit={handleSubmit}
        actions={
          <Stack direction="row">
            <Button id="btn.new-request.cancel" label="Cancel" to="screen.my-leave" />
            <Button id="btn.new-request.submit" label="Submit" emphasis="primary" submit />
          </Stack>
        }
      >
        <Field
          id="field.type"
          name="type"
          label="Leave type"
          type="select"
          options={["Vacation", "Sick", "Personal"]}
          required
          error={state === "state.validation-error" ? "Choose a leave type" : undefined}
        />
        <Field id="field.start-date" name="startDate" label="Start date" type="date" required />
        <Field id="field.end-date" name="endDate" label="End date" type="date" required />
        <Field
          id="field.reason"
          name="reason"
          label="Reason"
          type="textarea"
          required
          error={state === "state.validation-error" ? "Give a reason for the request" : undefined}
        />
      </Form>
    </Screen>
  );
}

function TeamQueue() {
  const state = useDisplayState();
  const requestsCol = useCollection<LeaveRequest>("leaveRequests");
  const pending = state === "state.empty"
    ? []
    : requestsCol.items.filter((r) => r.employeeId !== CURRENT_EMPLOYEE_ID && r.status === "pending");

  return (
    <Screen nav={nav}>
      <Heading id="heading.team-queue" text="Pending Requests" />
      {state === "state.failed" && (
        <Alert id="alert.team-queue-failed" tone="error" title="Could not load the team's requests" text="Try again in a few minutes." />
      )}
      <Table
        id="table.team-queue"
        columns={["Employee", "Dates", "Type", "Reason"]}
        rows={pending.map((r) => ({
          id: `row.team-queue.${r.id}`,
          cells: [r.employeeName, `${r.startDate} - ${r.endDate}`, r.type, r.reason],
          to: "screen.request-detail",
          params: { requestId: r.id },
        }))}
        empty={<EmptyState id="empty.team-queue" title="Nothing pending" text="New requests from your team appear here." />}
      />
    </Screen>
  );
}

function RequestDetail() {
  const { requestId } = useParams();
  const state = useDisplayState();
  const nav_ = useNav();
  const requestsCol = useCollection<LeaveRequest>("leaveRequests");
  const [comment, setComment] = useState("");

  const fallback = requestsCol.items.find((r) => r.status === "pending" && r.employeeId !== CURRENT_EMPLOYEE_ID);
  const request = (requestId ? requestsCol.get(requestId) : undefined) ?? fallback ?? requestsCol.items[0]!;

  const approve = () => {
    requestsCol.update(request.id, { status: "approved" });
    nav_.go("screen.team-queue");
  };

  const reject = () => {
    if (!comment.trim()) return;
    requestsCol.update(request.id, { status: "rejected", comment });
    nav_.go("screen.team-queue");
  };

  return (
    <Screen nav={nav}>
      <Heading id="heading.request-detail" text={`Request from ${request.employeeName}`} />
      <Detail
        id="detail.request"
        fields={[
          { label: "Type", value: request.type },
          { label: "Dates", value: `${request.startDate} - ${request.endDate}` },
          { label: "Reason", value: request.reason },
        ]}
      />
      <Field
        id="field.comment"
        label="Comment (required to reject)"
        type="textarea"
        value={comment}
        onChange={setComment}
        error={state === "state.validation-error" ? "A comment is required to reject a request" : undefined}
      />
      <Stack direction="row">
        <Button id="btn.reject" label="Reject" emphasis="danger" onPress={reject} />
        <Button id="btn.approve" label="Approve" emphasis="primary" onPress={approve} />
      </Stack>
    </Screen>
  );
}

function TeamHistory() {
  const state = useDisplayState();
  const requestsCol = useCollection<LeaveRequest>("leaveRequests");
  const decided = state === "state.empty"
    ? []
    : requestsCol.items.filter((r) => r.employeeId !== CURRENT_EMPLOYEE_ID && r.status !== "pending");

  return (
    <Screen nav={nav}>
      <Heading id="heading.team-history" text="Team History" />
      <Table
        id="table.team-history"
        columns={["Employee", "Dates", "Type", "Status", "Comment"]}
        rows={decided.map((r) => ({
          id: `row.team-history.${r.id}`,
          cells: [r.employeeName, `${r.startDate} - ${r.endDate}`, r.type, r.status, r.comment ?? ""],
          tone: toneForStatus(r.status),
        }))}
        empty={<EmptyState id="empty.team-history" title="No decided requests yet" text="Approved and rejected requests appear here." />}
      />
    </Screen>
  );
}

function TeamBalances() {
  const balancesCol = useCollection<LeaveBalance>("balances");
  const teamBalances = balancesCol.items.filter((b) => b.employeeId !== CURRENT_EMPLOYEE_ID);
  const employeeIds = Array.from(new Set(teamBalances.map((b) => b.employeeId)));

  const rows = employeeIds.map((employeeId) => {
    const rowsFor = teamBalances.filter((b) => b.employeeId === employeeId);
    const name = rowsFor[0]?.employeeName ?? employeeId;
    const of = (type: LeaveBalance["type"]) => rowsFor.find((b) => b.type === type)?.balance ?? 0;
    return { employeeId, name, vacation: of("Vacation"), sick: of("Sick"), personal: of("Personal") };
  });

  return (
    <Screen nav={nav}>
      <Heading id="heading.team-balances" text="Team Balances" />
      <Table
        id="table.team-balances"
        columns={["Employee", "Vacation", "Sick", "Personal"]}
        rows={rows.map((r) => ({
          id: `row.team-balances.${r.employeeId}`,
          cells: [r.name, String(r.vacation), String(r.sick), String(r.personal)],
          to: "screen.adjust-balance",
          params: { employeeId: r.employeeId },
        }))}
        empty={<EmptyState id="empty.team-balances" title="No team members yet" text="Team balances appear here." />}
      />
    </Screen>
  );
}

function AdjustBalance() {
  const { employeeId } = useParams();
  const state = useDisplayState();
  const nav_ = useNav();
  const balancesCol = useCollection<LeaveBalance>("balances");

  const targetId = employeeId ?? "emp-alex";
  const employeeBalances = balancesCol.items.filter((b) => b.employeeId === targetId);
  const employeeName = employeeBalances[0]?.employeeName ?? "Team Member";

  const handleSubmit = (values: Record<string, string>) => {
    const match = balancesCol.items.find((b) => b.employeeId === targetId && b.type === values.type);
    if (match) {
      balancesCol.update(match.id, { balance: Number(values.balance) });
    }
    nav_.go("screen.team-balances");
  };

  return (
    <Screen nav={nav}>
      <Heading id="heading.adjust-balance" text={`Adjust Balance — ${employeeName}`} />
      <Form
        id="form.adjust-balance"
        onSubmit={handleSubmit}
        actions={
          <Stack direction="row">
            <Button id="btn.adjust-balance.cancel" label="Cancel" to="screen.team-balances" />
            <Button id="btn.adjust-balance.save" label="Save" emphasis="primary" submit />
          </Stack>
        }
      >
        <Field
          id="field.adjust-type"
          name="type"
          label="Leave type"
          type="select"
          options={["Vacation", "Sick", "Personal"]}
          required
          error={state === "state.validation-error" ? "Choose a leave type" : undefined}
        />
        <Field id="field.adjust-balance" name="balance" label="New balance (days)" type="number" required />
      </Form>
    </Screen>
  );
}

export default defineApp({
  screens: {
    "screen.my-leave": MyLeave,
    "screen.new-request": NewRequestScreen,
    "screen.team-queue": TeamQueue,
    "screen.request-detail": RequestDetail,
    "screen.team-history": TeamHistory,
    "screen.team-balances": TeamBalances,
    "screen.adjust-balance": AdjustBalance,
  },
  data: { leaveRequests, balances },
});
