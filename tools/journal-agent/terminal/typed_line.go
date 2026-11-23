package terminal

import "errors"

// TypedLine is a line the journal typed into the composer for one request attempt, before it is submitted.
type TypedLine struct {
	RequestID   string
	Attempt     int
	Text        string
	// drawnFrom is the composer's generation when the line was written into it: a later one means the program redrew.
	drawnFrom   uint64
	enters      int
	invalidated bool
	// stranded is a line a browser take found on its way; settled closes once the take settled it, and cancelled says
	// it was cleared before any Enter.
	stranded  bool
	cancelled bool
	settled   chan struct{}
}

// Delivery is what became of a typed line.
type Delivery string

const (
	// Delivered is a line the program drew in the composer before its one Enter.
	Delivered Delivery = "delivered"
	// DeliveryUncertain is a line the program never drew, or whose Enter may already have submitted it: the
	// journal does not know, so it never retries blindly and never calls it the user's text.
	DeliveryUncertain Delivery = "delivery-uncertain"
)

var (
	// ErrComposerHeld refuses a driver line while the composer holds text or changed since the caller read it.
	ErrComposerHeld = errors.New("the composer holds text or changed since it was read: the driver line waits")
	// ErrLineInvalidated refuses to submit a driver line the user typed over; their keys went through instead.
	ErrLineInvalidated = errors.New("the user typed while the driver line was pending: it is not submitted")
	// ErrLineStranded refuses to submit a driver line a browser take is settling; Settlement says how it ended.
	ErrLineStranded = errors.New("a browser take is settling the driver line: it is not submitted")
	// ErrUserTyping refuses driver keys while the user holds the input.
	ErrUserTyping = errors.New("the user holds the input: driver keys wait")
)
