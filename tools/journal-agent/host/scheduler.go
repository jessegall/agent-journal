package host

import (
	"sync"

	"journal-agent/client"
)

// The operations a claimed request can carry, as the journal names them (App\Agents\Enums\DriverOperation).
const (
	operationDeliver      = "deliver"
	operationWake         = "wake"
	operationChangeModel  = "change_model"
	operationChangeEffort = "change_effort"
	operationInterrupt    = "interrupt"
	operationStop         = "stop"
	operationStartRecord  = "start_recording"
	operationStopRecord   = "stop_recording"
	operationKeyScript    = "key_script"
)

// maxBatch is the fixed cut-off of consecutive deliveries one turn takes.
const maxBatch = 8

// Admission is what one runtime may do next: a control to carry out at once, settings to stage, and either the
// deliveries and wakes of one turn or one key script run alone. Superseded settings were replaced by a later one of
// the same kind before they ran.
type Admission struct {
	Control    *client.ClaimedRequest
	Staged     []client.ClaimedRequest
	Superseded []client.ClaimedRequest
	Deliveries []client.ClaimedRequest
	Wakes      []client.ClaimedRequest
	Script     *client.ClaimedRequest
}

// IsEmpty says whether the admission asks for nothing.
func (admission Admission) IsEmpty() bool {
	return admission.Control == nil && len(admission.Staged) == 0 && len(admission.Deliveries) == 0 &&
		len(admission.Wakes) == 0 && admission.Script == nil
}

// StartsTurn says whether the admission starts a turn of the program.
func (admission Admission) StartsTurn() bool {
	return len(admission.Deliveries) > 0 || len(admission.Wakes) > 0
}

// RuntimeQueue keeps one runtime's claimed requests in their accepted order and decides what may run next
// (doc 40, sections 16 and 17).
type RuntimeQueue struct {
	pending []client.ClaimedRequest
	busy    bool
	held    bool
	// reconciling is set while a repaired setting waits for the program's own evidence that it took effect; content
	// behind it waits too.
	reconciling bool
}

// Add puts claimed requests behind the ones already waiting, in sequence order.
func (queue *RuntimeQueue) Add(requests ...client.ClaimedRequest) {
	for _, request := range requests {
		at := len(queue.pending)
		for at > 0 && queue.pending[at-1].Sequence > request.Sequence {
			at--
		}
		queue.pending = append(queue.pending[:at], append([]client.ClaimedRequest{request}, queue.pending[at:]...)...)
	}
}

// TurnStarted, TurnFinished, Hold and Release record what the host saw the runtime do.
func (queue *RuntimeQueue) TurnStarted()  { queue.busy = true }
func (queue *RuntimeQueue) TurnFinished() { queue.busy = false }
func (queue *RuntimeQueue) Hold()         { queue.held = true }
func (queue *RuntimeQueue) Release()      { queue.held = false }

// SettingsReconciled records the program's evidence that a repaired setting took effect, so content may run again.
func (queue *RuntimeQueue) SettingsReconciled() { queue.reconciling = false }

// Next takes what may run now out of the queue. A stop or an interrupt goes first, past everything; an interrupt also
// holds the runtime, so nothing waiting restarts work until it is released. A held runtime admits nothing else. A
// busy runtime only stages the settings at the front of the queue. An idle one stages those settings, then takes a
// key script at the front to run alone, or else the deliveries and wakes up to the next barrier, at most maxBatch
// deliveries, as one turn.
func (queue *RuntimeQueue) Next() Admission {
	if control, found := queue.takeControl(); found {
		if control.Operation == operationInterrupt {
			queue.held = true
		}
		return Admission{Control: &control}
	}
	if queue.held {
		return Admission{}
	}

	admission := queue.takeLeadingSettings()
	if queue.busy || queue.reconciling {
		return admission
	}
	if len(queue.pending) > 0 && queue.pending[0].Operation == operationKeyScript {
		script := queue.pending[0]
		admission.Script = &script
		queue.pending = queue.pending[1:]
		return admission
	}
	for len(queue.pending) > 0 {
		next := queue.pending[0]
		if next.Operation == operationDeliver && len(admission.Deliveries) < maxBatch {
			admission.Deliveries = append(admission.Deliveries, next)
		} else if next.Operation == operationWake {
			admission.Wakes = append(admission.Wakes, next)
		} else {
			break
		}
		queue.pending = queue.pending[1:]
	}
	return admission
}

func (queue *RuntimeQueue) takeControl() (client.ClaimedRequest, bool) {
	for at, request := range queue.pending {
		if isControl(request) {
			queue.pending = append(queue.pending[:at], queue.pending[at+1:]...)
			return request, true
		}
	}
	return client.ClaimedRequest{}, false
}

// takeLeadingSettings stages the settings at the front of the queue; of two of the same kind only the later stays.
func (queue *RuntimeQueue) takeLeadingSettings() Admission {
	var admission Admission
	latest := map[string]int{}
	for len(queue.pending) > 0 && isSetting(queue.pending[0]) {
		setting := queue.pending[0]
		queue.pending = queue.pending[1:]
		if earlier, found := latest[setting.Operation]; found {
			admission.Superseded = append(admission.Superseded, admission.Staged[earlier])
			admission.Staged[earlier] = setting
			continue
		}
		latest[setting.Operation] = len(admission.Staged)
		admission.Staged = append(admission.Staged, setting)
		if setting.Attempt > 0 {
			queue.reconciling = true
		}
	}
	return admission
}

// isControl answers whether the request acts on the runtime itself rather than its turns: a stop, an interrupt or
// a recording; it goes first and never waits behind content.
func isControl(request client.ClaimedRequest) bool {
	switch request.Operation {
	case operationStop, operationInterrupt, operationStartRecord, operationStopRecord:
		return true
	}
	return false
}

func isSetting(request client.ClaimedRequest) bool {
	return request.Operation == operationChangeModel || request.Operation == operationChangeEffort
}

// Scheduler keeps a queue per runtime and lets one caller at a time change them, so the effects on a runtime are
// carried out in order.
type Scheduler struct {
	mutex  sync.Mutex
	queues map[string]*RuntimeQueue
}

// NewScheduler returns an empty scheduler.
func NewScheduler() *Scheduler {
	return &Scheduler{queues: map[string]*RuntimeQueue{}}
}

// Add files claimed requests under their runtimes.
func (scheduler *Scheduler) Add(requests []client.ClaimedRequest) {
	scheduler.mutex.Lock()
	defer scheduler.mutex.Unlock()
	for _, request := range requests {
		scheduler.queueOf(request.RuntimeID).Add(request)
	}
}

// With runs change on one runtime's queue while no other caller changes any queue.
func (scheduler *Scheduler) With(runtimeID string, change func(queue *RuntimeQueue)) {
	scheduler.mutex.Lock()
	defer scheduler.mutex.Unlock()
	change(scheduler.queueOf(runtimeID))
}

func (scheduler *Scheduler) queueOf(runtimeID string) *RuntimeQueue {
	queue, found := scheduler.queues[runtimeID]
	if !found {
		queue = &RuntimeQueue{}
		scheduler.queues[runtimeID] = queue
	}
	return queue
}
