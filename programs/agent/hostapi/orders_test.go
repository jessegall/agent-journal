package hostapi

import (
	"context"
	"errors"

	"journal-agent/client"
)

// testOrders are the parts of a host a test holds, the others left out, so the test sends its order through the
// protocol's strict dispatch as the host does.
type testOrders struct {
	*ProcessTable
	ProcessInput
	reads *ProjectReads
}

// ReadProject reads through the test's project reads; a test without them carries no project read.
func (orders testOrders) ReadProject(ctx context.Context, order Order, read client.ProjectRead) (map[string]any, error) {
	if orders.reads == nil {
		return nil, errors.New("this test carries no project reads")
	}
	return orders.reads.ReadProject(ctx, order, read)
}

// Upgrade is no order a test of hostapi carries.
func (testOrders) Upgrade(context.Context, Order, UpgradePlan) (map[string]any, error) {
	return nil, errors.New("this test carries no upgrade")
}

// carry is the executor of the order type, as the host's dispatch runs it, over the test's parts.
func carry(orders testOrders, orderType string) Executor {
	return Executors(orders)[orderType]
}
