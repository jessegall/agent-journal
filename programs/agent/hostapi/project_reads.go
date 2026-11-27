package hostapi

import (
	"context"

	"journal-agent/client"
	"journal-agent/host"
)

// ProjectReads carries out read_project instructions on a connected project's folder: the read is answered on its own
// report, which the journal keeps for whoever asked.
type ProjectReads struct {
	Reader  host.ProjectReader
	Journal Journal
}

// ReadProject answers the project read on its own report, and the instruction with no facts.
func (reads ProjectReads) ReadProject(ctx context.Context, instruction Instruction, read client.ProjectRead) (Empty, error) {
	if read.ID == "" {
		return Empty{}, RefusalError{Refusal: Unsafe, Reason: "the read_project instruction names no project read"}
	}
	if err := reads.Journal.NotifyProjectRead(ctx, read.ID, reads.Reader.Answer(read)); err != nil {
		return Empty{}, err
	}
	return Empty{}, nil
}
