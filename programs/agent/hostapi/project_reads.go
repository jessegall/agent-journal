package hostapi

import (
	"context"

	"journal-agent/client"
	"journal-agent/host"
)

// ProjectReads carries out read_project orders on a connected project's folder: the read is answered on its own
// report, which the journal keeps for the agent that asked.
type ProjectReads struct {
	Reader  host.ProjectReader
	Journal Journal
}

// ReadProject answers the project read on its own report, and the order with no facts.
func (reads ProjectReads) ReadProject(ctx context.Context, order Order, read client.ProjectRead) (map[string]any, error) {
	if read.ID == "" {
		return nil, RefusalError{Refusal: Unsafe, Reason: "the read_project order names no project read"}
	}
	if err := reads.Journal.NotifyProjectRead(ctx, read.ID, reads.Reader.Answer(read)); err != nil {
		return nil, err
	}
	return map[string]any{}, nil
}
