package terminal

import "errors"

// TypedLine is a line the journal typed into the composer for one request attempt, before it is submitted.
type TypedLine struct {
	RequestID   string
	Attempt     int
	Text        string
	enters      int
	invalidated bool
}

// Delivery is what became of a typed line.
type Delivery string

const (
	// Delivered is a line whose echo was seen in the composer before its one Enter.
	Delivered Delivery = "delivered"
	// DeliveryUncertain is a line whose echo was lost or changed, or whose Enter may already have submitted it: the
	// journal does not know, so it never retries blindly and never calls it the person's text.
	DeliveryUncertain Delivery = "delivery-uncertain"
)

var (
	// ErrComposerHeld refuses a driver line while the composer holds text or changed since the caller read it.
	ErrComposerHeld = errors.New("the composer holds text or changed since it was read: the driver line waits")
	// ErrLineInvalidated refuses to submit a driver line the person typed over; their keys went through instead.
	ErrLineInvalidated = errors.New("the person typed while the driver line was pending: it is not submitted")
)
