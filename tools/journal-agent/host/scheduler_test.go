package host

import (
	"testing"

	"journal-agent/client"
)

func request(sequence int, operation string) client.ClaimedRequest {
	return client.ClaimedRequest{RuntimeID: "runtime", RequestID: operation + string(rune('0'+sequence)), Sequence: sequence, Operation: operation}
}

func sequences(requests []client.ClaimedRequest) []int {
	numbers := []int{}
	for _, request := range requests {
		numbers = append(numbers, request.Sequence)
	}
	return numbers
}

// turnOf is the sequence of the admission's one turn, or none.
func turnOf(admission Admission) []int {
	if admission.Turn == nil {
		return []int{}
	}
	return []int{admission.Turn.Sequence}
}

func equal(left, right []int) bool {
	if len(left) != len(right) {
		return false
	}
	for at := range left {
		if left[at] != right[at] {
			return false
		}
	}
	return true
}

// One test per row of the trace table.

func TestIdleDeliverIsAdmittedWithoutAWake(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Add(request(1, operationDeliver))

	admission := queue.Next()

	if !equal(turnOf(admission), []int{1}) {
		t.Fatalf("got %+v", admission)
	}
}

// The journal builds each turn's whole prompt, so the host joins no two requests into one turn.
func TestADeliveryAndAWakeAreTwoTurnsInTheirOrder(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Add(request(1, operationDeliver), request(2, operationWake), request(3, operationDeliver))

	first := queue.Next()
	queue.TurnStarted()
	queue.TurnFinished()
	second := queue.Next()
	queue.TurnStarted()
	queue.TurnFinished()
	third := queue.Next()

	if !equal(turnOf(first), []int{1}) || !equal(turnOf(second), []int{2}) || !equal(turnOf(third), []int{3}) {
		t.Fatalf("got %+v, %+v, %+v", first, second, third)
	}
}

func TestRunningTurnStagesEffortAndAdmitsTheDeliveryAfterIt(t *testing.T) {
	queue := RuntimeQueue{}
	queue.TurnStarted()
	queue.Add(request(1, operationChangeEffort), request(2, operationDeliver), request(3, operationWake))

	whileBusy := queue.Next()
	if !equal(sequences(whileBusy.Staged), []int{1}) || whileBusy.ShouldStartTurn() {
		t.Fatalf("while busy got %+v", whileBusy)
	}

	queue.TurnFinished()
	next := queue.Next()
	if !equal(turnOf(next), []int{2}) {
		t.Fatalf("after the turn got %+v", next)
	}
}

func TestSettingsAreABarrierBetweenDeliveries(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Add(request(1, operationDeliver), request(2, operationChangeModel), request(3, operationDeliver), request(4, operationWake))

	first := queue.Next()
	if !equal(turnOf(first), []int{1}) || len(first.Staged) != 0 {
		t.Fatalf("first turn got %+v", first)
	}
	queue.TurnStarted()
	queue.TurnFinished()

	second := queue.Next()
	if !equal(sequences(second.Staged), []int{2}) || !equal(turnOf(second), []int{3}) {
		t.Fatalf("second turn got %+v", second)
	}
}

func TestALaterEffortSupersedesAnEarlierOne(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Add(request(1, operationChangeEffort), request(2, operationChangeEffort), request(3, operationDeliver))

	admission := queue.Next()

	if !equal(sequences(admission.Superseded), []int{1}) || !equal(sequences(admission.Staged), []int{2}) || !equal(turnOf(admission), []int{3}) {
		t.Fatalf("got %+v", admission)
	}
}

func TestAWakeOnABusyRuntimeWaits(t *testing.T) {
	queue := RuntimeQueue{}
	queue.TurnStarted()
	queue.Add(request(1, operationWake))

	if !queue.Next().IsEmpty() {
		t.Fatal("a wake was admitted into a running turn")
	}
}

func TestAWakeOnAnIdleRuntimeMakesOneTurn(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Add(request(1, operationWake), request(2, operationWake))

	if admission := queue.Next(); !equal(turnOf(admission), []int{1}) {
		t.Fatalf("got %+v", admission)
	}
}

// An interrupt goes first; the queue keeps no hold of its own, since the journal offers no work to a runtime it holds.
func TestAnInterruptGoesFirstAndTheQueueHoldsNothingItself(t *testing.T) {
	queue := RuntimeQueue{}
	queue.TurnStarted()
	queue.Add(request(1, operationDeliver), request(2, operationInterrupt))

	interrupt := queue.Next()
	if interrupt.Control == nil || interrupt.Control.Sequence != 2 {
		t.Fatalf("got %+v", interrupt)
	}
	queue.TurnFinished()
	if !equal(turnOf(queue.Next()), []int{1}) {
		t.Fatal("the delivery the journal offered did not run after the interrupt")
	}
}

func TestContentBehindARepairedSettingWaitsUntilItIsReconciled(t *testing.T) {
	queue := RuntimeQueue{}
	repaired := request(1, operationChangeEffort)
	repaired.Attempt = 1
	queue.Add(repaired, request(2, operationDeliver))

	first := queue.Next()
	if !equal(sequences(first.Staged), []int{1}) || first.Turn != nil {
		t.Fatalf("content ran before the repaired setting was reconciled: %+v", first)
	}

	queue.EndReconciliation()
	second := queue.Next()
	if !equal(turnOf(second), []int{2}) {
		t.Fatalf("got %+v", second)
	}
}

func TestAKeyScriptRunsAloneAfterTheLeadingSettingsAndBeforeTheContentBehindIt(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Add(request(1, operationChangeEffort), request(2, operationKeyScript), request(3, operationDeliver))

	admission := queue.Next()
	if admission.Script == nil || admission.Script.Sequence != 2 || !equal(sequences(admission.Staged), []int{1}) ||
		admission.ShouldStartTurn() {
		t.Fatalf("the first admission is %+v", admission)
	}

	queue.TurnStarted()
	if waiting := queue.Next(); !waiting.IsEmpty() {
		t.Fatalf("a busy runtime admitted %+v while its script ran", waiting)
	}
	queue.TurnFinished()
	if next := queue.Next(); !equal(turnOf(next), []int{3}) || next.Script != nil {
		t.Fatalf("after the script the runtime admitted %+v", next)
	}
}

func TestAHeldRuntimeRunsNoKeyScript(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Hold()
	queue.Add(request(1, operationKeyScript))

	if admission := queue.Next(); !admission.IsEmpty() {
		t.Fatalf("a held runtime admitted %+v", admission)
	}
}
