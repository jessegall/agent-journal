package hostapi

import (
	"context"
	"errors"
	"slices"
	"sync"
)

// Executor carries out one type of order and gives the facts of its answer, or a RefusalError.
type Executor func(ctx context.Context, order Order) (map[string]any, error)

// Dispatcher runs the orders the host claimed: each is checked, answered from the record when it was answered
// before, and otherwise carried out by the executor of its type. Orders of one process run one after another in the
// order handed out; orders of different processes run at once; host-wide orders wait for none of them.
type Dispatcher struct {
	verifier  Verifier
	record    *AnsweredRecord
	executors map[string]Executor
	report    func(Answer)

	mutex    sync.Mutex
	lanes    map[string]chan Order
	inFlight map[string]bool
	running  sync.WaitGroup
}

// NewDispatcher dispatches with these executors and hands every answer to report once the record holds it.
func NewDispatcher(verifier Verifier, record *AnsweredRecord, executors map[string]Executor, report func(Answer)) *Dispatcher {
	return &Dispatcher{
		verifier:  verifier,
		record:    record,
		executors: executors,
		report:    report,
		lanes:     map[string]chan Order{},
		inFlight:  map[string]bool{},
	}
}

// Submit takes one claimed order; an order already running is not taken twice.
func (dispatcher *Dispatcher) Submit(ctx context.Context, order Order) {
	if answer, found := dispatcher.record.Find(order.ID); found {
		dispatcher.report(answer)
		return
	}
	dispatcher.mutex.Lock()
	if dispatcher.inFlight[order.ID] {
		dispatcher.mutex.Unlock()
		return
	}
	dispatcher.inFlight[order.ID] = true
	dispatcher.running.Add(1)
	if order.IsHostWide() {
		dispatcher.mutex.Unlock()
		go func() {
			dispatcher.carryOut(ctx, order)
		}()
		return
	}
	lane := dispatcher.laneOf(ctx, order.ProcessID)
	dispatcher.mutex.Unlock()
	lane <- order
}

// Wait returns once every order submitted so far was answered.
// Capabilities are the order types this host carries out, as its inventory lists them.
func (dispatcher *Dispatcher) Capabilities() []string {
	capabilities := make([]string, 0, len(dispatcher.executors))
	for orderType := range dispatcher.executors {
		capabilities = append(capabilities, orderType)
	}
	slices.Sort(capabilities)
	return capabilities
}

func (dispatcher *Dispatcher) Wait() {
	dispatcher.running.Wait()
}

// laneOf is the queue of one process's orders, started on its first order; the caller holds the mutex.
func (dispatcher *Dispatcher) laneOf(ctx context.Context, processID string) chan Order {
	lane, found := dispatcher.lanes[processID]
	if found {
		return lane
	}
	lane = make(chan Order, 64)
	dispatcher.lanes[processID] = lane
	go func() {
		for order := range lane {
			dispatcher.carryOut(ctx, order)
		}
	}()
	return lane
}

func (dispatcher *Dispatcher) carryOut(ctx context.Context, order Order) {
	defer dispatcher.running.Done()
	answer := dispatcher.answerOf(ctx, order)
	if err := dispatcher.record.Keep(order, answer, dispatcher.verifier.Now()); err != nil {
		answer = RefusedFor(order, Unsafe, map[string]any{"reason": "the host could not record its answer: " + err.Error()})
	}
	dispatcher.mutex.Lock()
	delete(dispatcher.inFlight, order.ID)
	dispatcher.mutex.Unlock()
	dispatcher.report(answer)
}

func (dispatcher *Dispatcher) answerOf(ctx context.Context, order Order) Answer {
	if err := dispatcher.verifier.Verify(order); err != nil {
		return refusalAnswer(order, err, nil)
	}
	executor, found := dispatcher.executors[order.Type]
	if !found {
		return RefusedFor(order, UnknownOrder, map[string]any{"reason": "this host does not carry out " + order.Type})
	}
	facts, err := executor(ctx, order)
	if err != nil {
		return refusalAnswer(order, err, facts)
	}
	return DoneWith(order, facts)
}

// refusalAnswer is the answer of a refused order, with the facts the host saw, such as the current row hash.
func refusalAnswer(order Order, err error, facts map[string]any) Answer {
	if facts == nil {
		facts = map[string]any{}
	}
	var refusal RefusalError
	if errors.As(err, &refusal) {
		facts["reason"] = refusal.Reason
		return RefusedFor(order, refusal.Refusal, facts)
	}
	facts["reason"] = err.Error()
	return RefusedFor(order, Unsafe, facts)
}
