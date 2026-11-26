package host

import (
	"log"
	"strconv"
	"sync/atomic"
	"time"

	"journal-agent/client"
)

// UsageSink is where a usage reader of one claimed start hands what it observed: it stamps each observation with
// the start's execution as its source, the next number of that source's order and the UTC second it arrived, and
// queues it privately. A full queue loses the observation with a local log line and never fails the turn. Reports
// of a start are still sent after it stopped.
type UsageSink struct {
	reports    *UsageReports
	startKey   string
	generation int
	method     string
	execution  string
	order      atomic.Int64
	now        func() time.Time
}

// WindowReading is one limit window a program reported: its limit and slot, and the used percent from 0 to 100, its
// length in minutes and its reset, each only when reported.
type WindowReading struct {
	LimitID       string
	Slot          string
	UsedPercent   *float64
	WindowMinutes *int
	ResetsAt      *time.Time
}

// ThreadCount is the latest token count a program reported for one thread: its total and the parts it named.
type ThreadCount struct {
	ThreadID        string
	Total           int64
	Input           *int64
	CachedInput     *int64
	Output          *int64
	ReasoningOutput *int64
	LastTurnTotal   *int64
}

// NewUsageSink binds a sink to the start the host prepared: its key, the sign-in generation and method of its saved
// account, and its process generation, which with the key names the execution every observation comes from.
func NewUsageSink(prepared PreparedStart, reports *UsageReports) *UsageSink {
	claim := prepared.Claim
	execution := claim.StartKey + ":" + strconv.Itoa(prepared.Runtime().ProcessGeneration)
	return &UsageSink{reports: reports, startKey: claim.StartKey, generation: claim.Generation,
		method: claim.SignInMethod, execution: execution, now: time.Now}
}

// Method is the sign-in method of the start's saved account, which decides what its readers observe.
func (sink *UsageSink) Method() string {
	return sink.method
}

func (sink *UsageSink) Window(reading WindowReading) {
	measurement := client.UsageMeasurement{Type: client.UsageWindow, LimitID: reading.LimitID, Slot: reading.Slot,
		UsedPercent: reading.UsedPercent, WindowMinutes: reading.WindowMinutes}
	if reading.ResetsAt != nil {
		measurement.ResetsAt = utcSecond(*reading.ResetsAt)
	}
	sink.queue(sink.execution, measurement)
}

func (sink *UsageSink) ThreadTokens(count ThreadCount) {
	total := count.Total
	sink.queue(sink.execution, client.UsageMeasurement{Type: client.UsageThreadTokens, ThreadID: count.ThreadID,
		Total: &total, Input: count.Input, CachedInput: count.CachedInput, Output: count.Output,
		ReasoningOutput: count.ReasoningOutput, LastTurnTotal: count.LastTurnTotal})
}

func (sink *UsageSink) queue(source string, measurement client.UsageMeasurement) {
	report := client.UsageReport{StartKey: sink.startKey, Generation: sink.generation, SourceID: source,
		SourceOrder: sink.order.Add(1), ObservedAt: utcSecond(sink.now()), Measurement: measurement}
	if err := sink.reports.Queue(report); err != nil {
		log.Printf("a usage observation of start %s was lost: %v", sink.startKey, err)
	}
}

func utcSecond(moment time.Time) string {
	return moment.UTC().Truncate(time.Second).Format(time.RFC3339)
}
