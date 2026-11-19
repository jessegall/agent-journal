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

// Doc 40 section 17, one test per row of the trace table.

func TestIdleDeliverIsAdmittedWithoutAWake(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Add(request(1, operationDeliver))

	admission := queue.Next()

	if !equal(sequences(admission.Deliveries), []int{1}) || len(admission.Wakes) != 0 {
		t.Fatalf("got %+v", admission)
	}
}

func TestIdleDeliverAndWakeMakeOneActivation(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Add(request(1, operationDeliver), request(2, operationWake))

	admission := queue.Next()

	if !equal(sequences(admission.Deliveries), []int{1}) || !equal(sequences(admission.Wakes), []int{2}) {
		t.Fatalf("got %+v", admission)
	}
	if !queue.Next().IsEmpty() {
		t.Fatal("a second activation was admitted")
	}
}

func TestRunningTurnStagesEffortAndAdmitsTheDeliveryAfterIt(t *testing.T) {
	queue := RuntimeQueue{}
	queue.TurnStarted()
	queue.Add(request(1, operationChangeEffort), request(2, operationDeliver), request(3, operationWake))

	whileBusy := queue.Next()
	if !equal(sequences(whileBusy.Staged), []int{1}) || whileBusy.StartsTurn() {
		t.Fatalf("while busy got %+v", whileBusy)
	}

	queue.TurnFinished()
	next := queue.Next()
	if !equal(sequences(next.Deliveries), []int{2}) || !equal(sequences(next.Wakes), []int{3}) {
		t.Fatalf("after the turn got %+v", next)
	}
}

func TestSettingsAreABarrierBetweenDeliveries(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Add(request(1, operationDeliver), request(2, operationChangeModel), request(3, operationDeliver), request(4, operationWake))

	first := queue.Next()
	if !equal(sequences(first.Deliveries), []int{1}) || len(first.Staged) != 0 || len(first.Wakes) != 0 {
		t.Fatalf("first turn got %+v", first)
	}
	queue.TurnStarted()
	queue.TurnFinished()

	second := queue.Next()
	if !equal(sequences(second.Staged), []int{2}) || !equal(sequences(second.Deliveries), []int{3}) || !equal(sequences(second.Wakes), []int{4}) {
		t.Fatalf("second turn got %+v", second)
	}
	if !queue.Next().IsEmpty() {
		t.Fatal("the wake added an empty turn")
	}
}

func TestALaterEffortSupersedesAnEarlierOne(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Add(request(1, operationChangeEffort), request(2, operationChangeEffort), request(3, operationDeliver))

	admission := queue.Next()

	if !equal(sequences(admission.Superseded), []int{1}) || !equal(sequences(admission.Staged), []int{2}) || !equal(sequences(admission.Deliveries), []int{3}) {
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

func TestAWakeOnAnIdleRuntimeMakesOneActivation(t *testing.T) {
	queue := RuntimeQueue{}
	queue.Add(request(1, operationWake), request(2, operationWake))

	admission := queue.Next()

	if len(admission.Deliveries) != 0 || !equal(sequences(admission.Wakes), []int{1, 2}) {
		t.Fatalf("got %+v", admission)
	}
}

func TestAnInterruptGoesFirstAndHoldsEverythingElse(t *testing.T) {
	queue := RuntimeQueue{}
	queue.TurnStarted()
	queue.Add(request(1, operationDeliver), request(2, operationWake), request(3, operationInterrupt))

	interrupt := queue.Next()
	if interrupt.Control == nil || interrupt.Control.Sequence != 3 {
		t.Fatalf("got %+v", interrupt)
	}
	queue.TurnFinished()
	if !queue.Next().IsEmpty() {
		t.Fatal("pending work restarted after the interrupt")
	}
	queue.Release()
	if !equal(sequences(queue.Next().Deliveries), []int{1}) {
		t.Fatal("the release did not let the pending delivery run")
	}
}

func TestContentBehindARepairedSettingWaitsUntilItIsReconciled(t *testing.T) {
	queue := RuntimeQueue{}
	repaired := request(1, operationChangeEffort)
	repaired.Attempt = 1
	queue.Add(repaired, request(2, operationDeliver))

	first := queue.Next()
	if !equal(sequences(first.Staged), []int{1}) || len(first.Deliveries) != 0 {
		t.Fatalf("content ran before the repaired setting was reconciled: %+v", first)
	}

	queue.SettingsReconciled()
	second := queue.Next()
	if !equal(sequences(second.Deliveries), []int{2}) {
		t.Fatalf("got %+v", second)
	}
}
