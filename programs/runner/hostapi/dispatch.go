package hostapi

import (
	"context"
	"errors"
	"slices"
	"sync"
)

// Executor carries out one type of instruction and gives the facts of its answer, or a RefusalError.
type Executor func(ctx context.Context, instruction Instruction) (map[string]any, error)

// Dispatcher runs the instructions the host claimed: each is checked, answered from the record when it was answered
// before, and otherwise carried out by the executor of its type. Instructions of one process run one after another in the
// instruction handed out; instructions of different processes run at once; host-wide instructions wait for none of them.
type Dispatcher struct {
	verifier  Verifier
	record    *AnsweredRecord
	executors map[string]Executor
	report    func(Instruction, Answer)

	mutex    sync.Mutex
	lanes    map[string]chan Instruction
	inFlight map[string]bool
	running  sync.WaitGroup
}

// NewDispatcher dispatches with these executors and hands every answer, with its instruction, to report once the record
// holds it.
func NewDispatcher(verifier Verifier, record *AnsweredRecord, executors map[string]Executor, report func(Instruction, Answer)) *Dispatcher {
	return &Dispatcher{
		verifier:  verifier,
		record:    record,
		executors: executors,
		report:    report,
		lanes:     map[string]chan Instruction{},
		inFlight:  map[string]bool{},
	}
}

// Submit takes one claimed instruction; an instruction already running is not taken twice.
func (dispatcher *Dispatcher) Submit(ctx context.Context, instruction Instruction) {
	if answer, found := dispatcher.record.Find(instruction.ID); found {
		dispatcher.report(instruction, answer)
		return
	}
	dispatcher.mutex.Lock()
	if dispatcher.inFlight[instruction.ID] {
		dispatcher.mutex.Unlock()
		return
	}
	dispatcher.inFlight[instruction.ID] = true
	dispatcher.running.Add(1)
	if instruction.IsHostWide() {
		dispatcher.mutex.Unlock()
		go func() {
			dispatcher.carryOut(ctx, instruction)
		}()
		return
	}
	lane := dispatcher.laneOf(ctx, instruction.ProcessID)
	dispatcher.mutex.Unlock()
	lane <- instruction
}

// Wait returns once every instruction submitted so far was answered.
// Capabilities are the instruction types this host carries out, as its inventory lists them.
func (dispatcher *Dispatcher) Capabilities() []string {
	capabilities := make([]string, 0, len(dispatcher.executors))
	for instructionType := range dispatcher.executors {
		capabilities = append(capabilities, instructionType)
	}
	slices.Sort(capabilities)
	return capabilities
}

func (dispatcher *Dispatcher) Wait() {
	dispatcher.running.Wait()
}

// laneOf is the queue of one process's instructions, started on its first instruction; the caller holds the mutex.
func (dispatcher *Dispatcher) laneOf(ctx context.Context, processID string) chan Instruction {
	lane, found := dispatcher.lanes[processID]
	if found {
		return lane
	}
	lane = make(chan Instruction, 64)
	dispatcher.lanes[processID] = lane
	go func() {
		for instruction := range lane {
			dispatcher.carryOut(ctx, instruction)
		}
	}()
	return lane
}

func (dispatcher *Dispatcher) carryOut(ctx context.Context, instruction Instruction) {
	defer dispatcher.running.Done()
	answer := dispatcher.answerOf(ctx, instruction)
	if err := dispatcher.record.Keep(instruction, answer, dispatcher.verifier.Now()); err != nil {
		answer = RefusedFor(instruction, Unsafe, "the host could not record its answer: "+err.Error(), nil)
	}
	dispatcher.mutex.Lock()
	delete(dispatcher.inFlight, instruction.ID)
	dispatcher.mutex.Unlock()
	dispatcher.report(instruction, answer)
}

func (dispatcher *Dispatcher) answerOf(ctx context.Context, instruction Instruction) Answer {
	if err := dispatcher.verifier.Verify(instruction); err != nil {
		return refusalAnswer(instruction, err, nil)
	}
	executor, found := dispatcher.executors[instruction.Type]
	if !found {
		return RefusedFor(instruction, UnknownInstruction, "this host does not carry out "+instruction.Type, nil)
	}
	if dispatcher.record.IsInterrupted(instruction.ID) && !InstructionTypes[instruction.Type].Repeatable {
		reason := "the host stopped while it carried this instruction out, so it is not carried out twice"
		return RefusedFor(instruction, HostRestarted, reason, nil)
	}
	if err := dispatcher.record.Start(instruction, dispatcher.verifier.Now()); err != nil {
		return RefusedFor(instruction, Unsafe, "the host could not record the instruction: "+err.Error(), nil)
	}
	facts, err := executor(ctx, instruction)
	if err != nil {
		return refusalAnswer(instruction, err, facts)
	}
	return DoneWith(instruction, facts)
}

// refusalAnswer is the answer of a refused instruction, with the facts the host saw, such as the current row hash.
func refusalAnswer(instruction Instruction, err error, facts map[string]any) Answer {
	var refusal RefusalError
	if errors.As(err, &refusal) {
		return RefusedFor(instruction, refusal.Refusal, refusal.Reason, facts)
	}
	return RefusedFor(instruction, Unsafe, err.Error(), facts)
}
