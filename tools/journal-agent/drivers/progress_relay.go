package drivers

import (
	"sync"

	"journal-agent/keyscripts"
)

// ProgressRelay hands each step a key script confirms to its receiver, which the serving loop sets once it runs
// the runtime; a step confirmed before that goes nowhere.
type ProgressRelay struct {
	mutex    sync.Mutex
	receiver func(keyscripts.Progress)
}

// SendTo makes the receiver the one every later step goes to.
func (relay *ProgressRelay) SendTo(receiver func(keyscripts.Progress)) {
	relay.mutex.Lock()
	defer relay.mutex.Unlock()

	relay.receiver = receiver
}

// Notify hands one confirmed step to the receiver, if one is set.
func (relay *ProgressRelay) Notify(progress keyscripts.Progress) {
	relay.mutex.Lock()
	receiver := relay.receiver
	relay.mutex.Unlock()
	if receiver == nil {
		return
	}

	receiver(progress)
}
