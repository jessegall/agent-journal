// Package hostapi is host protocol 1 on the host's side: the orders the journal signs, their check, the record of
// answers that keeps an order from running twice, and the dispatch that runs them in order per process.
package hostapi

// DoneWith is the answer of an order carried out, with the facts the journal reads from it.
func DoneWith(order Order, facts map[string]any) Answer {
	return Answer{OrderID: order.ID, Status: Done, Facts: facts}
}

// RefusedFor is the answer of an order the host did not carry out.
func RefusedFor(order Order, refusal Refusal, reason string, facts map[string]any) Answer {
	return Answer{OrderID: order.ID, Status: Refused, Refusal: refusal, Reason: reason, Facts: facts}
}

// IsHostWide says whether the order is about the host as a whole, so it waits for no process's orders.
func (order Order) IsHostWide() bool {
	return OrderTypes[order.Type].HostWide || order.ProcessID == ""
}
