package drivers

import (
	"context"
	"errors"

	"journal-agent/drivers/contracts"
	"journal-agent/terminal"
)

// clearLineKeys empties the composer's line in the terminal programs the host drives: the line kill a take uses to
// clear a driver's unfinished line and Save and clear uses for a browser writer's draft.
const clearLineKeys = "\x15"

var _ contracts.BrowserControlled = (*TerminalDriver)(nil)

// ControlFromBrowser carries out one browser writer's operation through the input gate, which serializes it with the
// local keyboard and the journal's own writes: a take settles a driver line first and reports the grant id as its
// binding, a renewal extends it, a cancel and a release end it, and an input, draft choice or screen check answers
// its payload-free receipt.
func (driver *TerminalDriver) ControlFromBrowser(
	_ context.Context,
	control contracts.BrowserControl,
) (contracts.OperationResult, error) {
	gate := driver.runtime.Gate
	switch control.Operation {
	case "take_control":
		return driver.take(control)
	case "cancel_take":
		gate.Cancel(control.TakeID)

		return contracts.OperationResult{Request: control.Request, Progress: contracts.ProgressApplied}, nil
	case "release_control":
		if err := gate.Release(control.GrantID); err != nil && !errors.Is(err, terminal.ErrGrantEnded) {
			return failed(control.Request), err
		}

		return contracts.OperationResult{Request: control.Request, Progress: contracts.ProgressApplied}, nil
	}

	receipt := gate.ApplyBrowser(driver.operationOf(control), driver.runtime.Layout, clearLineKeys)

	return contracts.OperationResult{Request: control.Request, Progress: progressOf(receipt.Outcome)}, nil
}

// take issues or renews the writer's grant for the program as it runs now.
func (driver *TerminalDriver) take(control contracts.BrowserControl) (contracts.OperationResult, error) {
	gate := driver.runtime.Gate
	if control.Generation != uint64(driver.runtime.ProcessGeneration) {
		return failed(control.Request), nil
	}

	var grant terminal.BrowserGrant
	var err error
	if control.Renew {
		grant, err = gate.Renew(control.GrantID)
	} else {
		grant, err = gate.TakeAfterSettling(control.TakeID, driver.grantScope(), clearLineKeys)
	}
	if errors.Is(err, terminal.ErrTakeUncertain) {
		return contracts.OperationResult{Request: control.Request, Progress: contracts.ProgressDeliveryUncertain}, nil
	}
	if err != nil {
		return failed(control.Request), nil
	}

	return contracts.OperationResult{
		Request:       control.Request,
		Progress:      contracts.ProgressApplied,
		ActualBinding: grant.ID,
	}, nil
}

// grantScope is what a grant of this driver is for: its process generation; a local program has no attachment
// incarnation of its own.
func (driver *TerminalDriver) grantScope() terminal.GrantScope {
	return terminal.GrantScope{Generation: uint64(driver.runtime.ProcessGeneration)}
}

// operationOf is the gate's operation for an input, a draft choice or a screen check.
func (driver *TerminalDriver) operationOf(control contracts.BrowserControl) terminal.BrowserOperation {
	operation := terminal.BrowserOperation{
		GrantID:        control.GrantID,
		Sequence:       control.Sequence,
		Generation:     control.Generation,
		PromptRevision: control.PromptRevision,
		Kind:           terminal.TextOperation,
		Text:           control.Text,
	}
	switch {
	case control.Operation == "check_screen":
		operation.Kind = terminal.CheckOperation
	case control.Operation == "draft_choice":
		operation.Kind, operation.Choice = terminal.ChoiceOperation, terminal.DraftChoice(control.Choice)
	case control.InputKind == "key":
		operation.Kind, operation.Key = terminal.KeyOperation, control.Key
	case control.InputKind == "paste":
		operation.Kind = terminal.PasteOperation
	case control.Text == "" && control.Enter:
		operation.Kind = terminal.EnterOperation
	case control.Enter:
		operation.Text += "\r"
	}

	return operation
}

// progressOf is how a receipt reads as the request's progress: written or a repeat of a written one is applied, an
// uncertain write is uncertain, and every refusal failed with nothing written.
func progressOf(outcome terminal.ReceiptOutcome) contracts.Progress {
	switch outcome {
	case terminal.Applied, terminal.Duplicate:
		return contracts.ProgressApplied
	case terminal.Uncertain:
		return contracts.ProgressDeliveryUncertain
	}

	return contracts.ProgressFailed
}
