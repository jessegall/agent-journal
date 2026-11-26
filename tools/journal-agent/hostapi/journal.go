package hostapi

import (
	"context"
	"errors"
	"net/url"
	"strconv"
	"time"

	"journal-agent/client"
)

// ClaimedOrders is what one long poll hands the host: its orders, and how long it may go without calling.
type ClaimedOrders struct {
	Orders            []Order   `json:"orders"`
	IdleWindowSeconds int       `json:"idle_window_s"`
	Now               time.Time `json:"now"`
}

// InventoryProcess is one process the host holds after a start, as the inventory reports it.
type InventoryProcess struct {
	ProcessID      string `json:"process_id"`
	Identity       string `json:"identity"`
	Container      string `json:"container,omitempty"`
	IsAlive        bool   `json:"is_alive"`
	IsTerminalHeld bool   `json:"is_terminal_held"`
	SpoolOffset    int64  `json:"spool_offset"`
}

// Inventory is what the host holds once it started: its protocol and release, the newest order it answered and its
// processes.
type Inventory struct {
	Protocol        int                `json:"protocol"`
	Release         string             `json:"release"`
	AnsweredThrough string             `json:"answered_through,omitempty"`
	Capabilities    []string           `json:"capabilities"`
	Processes       []InventoryProcess `json:"processes"`
}

// HostHeartbeat says the host is alive, with the processes that still run and the newest order it answered.
type HostHeartbeat struct {
	LiveProcesses   []string `json:"live_processes"`
	AnsweredThrough string   `json:"answered_through,omitempty"`
}

// Journal is the journal as host protocol 1 speaks to it: the long poll, the answers and the reports.
type Journal struct {
	Client *client.Client
}

// ClaimOrders long-polls for up to waitSeconds for at most limit orders; a journal that does not take protocol 1
// answers client.ErrProtocolRefused.
func (journal Journal) ClaimOrders(ctx context.Context, limit, waitSeconds int) (ClaimedOrders, error) {
	target := "/host/orders/claim?limit=" + strconv.Itoa(limit) + "&wait=" + strconv.Itoa(waitSeconds)
	var claimed ClaimedOrders
	return claimed, journal.Client.Call(ctx, target, nil, &claimed)
}

// AnswerOrder sends the host's answer to an order it claimed.
func (journal Journal) AnswerOrder(ctx context.Context, answer Answer) error {
	return journal.Client.Call(ctx, "/host/orders/"+url.PathEscape(answer.OrderID), answer, nil)
}

// AnswerUntilTaken sends the order's answer and, while the journal may not have received it, sends it again after
// each wait until the journal takes it, refuses it, the order expires or the host stops; it answers whether the journal
// took it. The journal answers a repeated answer as it did the first, so sending twice is safe.
func (journal Journal) AnswerUntilTaken(ctx context.Context, answer Answer, wait time.Duration, expires time.Time) error {
	for {
		err := journal.AnswerOrder(ctx, answer)
		if err == nil || !errors.Is(err, client.ErrUncertain) || !time.Now().Add(wait).Before(expires) {
			return err
		}
		select {
		case <-ctx.Done():
			return ctx.Err()
		case <-time.After(wait):
		}
	}
}

// NotifyProcessOutput sends what one of the host's processes printed.
func (journal Journal) NotifyProcessOutput(ctx context.Context, processID string, output Output) error {
	return journal.Client.Call(ctx, "/host/processes/"+url.PathEscape(processID)+"/output", output, nil)
}

// NotifyProcessReport sends that one of the host's processes runs, was healed, exited or was lost.
func (journal Journal) NotifyProcessReport(ctx context.Context, report ProcessReport) error {
	return journal.Client.Call(ctx, "/host/processes/"+url.PathEscape(report.ProcessID), report, nil)
}

// NotifyInventory sends what the host holds once it started.
func (journal Journal) NotifyInventory(ctx context.Context, inventory Inventory) error {
	return journal.Client.Call(ctx, "/host/inventory", inventory, nil)
}

// NotifyHostHeartbeat says the host is alive.
func (journal Journal) NotifyHostHeartbeat(ctx context.Context, heartbeat HostHeartbeat) error {
	return journal.Client.Call(ctx, "/host/heartbeat", heartbeat, nil)
}
