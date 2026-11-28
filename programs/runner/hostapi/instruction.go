// Package hostapi is host protocol 1 on the host's side: the instructions the journal signs, their check, the record of
// answers that keeps an instruction from running twice, and the dispatch that runs them in order per process.
package hostapi

import "time"

// DoneWith is the answer of an instruction carried out, with the facts the journal reads from it.
func DoneWith(instruction Instruction, facts map[string]any) Answer {
	return Answer{InstructionID: instruction.ID, Status: Done, Facts: facts}
}

// RefusedFor is the answer of an instruction the host did not carry out.
func RefusedFor(instruction Instruction, refusal Refusal, reason string, facts map[string]any) Answer {
	return Answer{InstructionID: instruction.ID, Status: Refused, Refusal: refusal, Reason: reason, Facts: facts}
}

// IsHostWide says whether the instruction is about the host as a whole, so it waits for no process's instructions.
func (instruction Instruction) IsHostWide() bool {
	return InstructionTypes[instruction.Type].HostWide || instruction.ProcessID == ""
}

// AnswerDeadline is zero for an opening, whose dated claim does not time its answer.
func (instruction Instruction) AnswerDeadline() time.Time {
	if InstructionTypes[instruction.Type].Opens {
		return time.Time{}
	}
	return instruction.ExpiresAt
}
