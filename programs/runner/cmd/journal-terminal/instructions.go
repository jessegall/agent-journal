package main

import (
	"sync"

	"journal-runner/hostapi"
	"journal-runner/terminal"
)

func readInstructions(
	link *hostapi.TerminalLink,
	session *terminal.Session,
	processID string,
	answering *sync.Mutex,
	done chan<- struct{},
) {
	defer close(done)
	for {
		message, body, err := link.Receive()
		if err != nil || message != hostapi.LinkInstruction {
			return
		}
		instruction, err := hostapi.ReadLocalLinkInstruction(body)
		if err != nil || instruction.ProcessID != processID {
			return
		}
		answering.Lock()
		answer := answerInstruction(link, session, instruction)
		err = link.Send(hostapi.LinkAnswer, answer)
		answering.Unlock()
		if err != nil {
			return
		}
	}
}

func answerInstruction(link *hostapi.TerminalLink, session *terminal.Session, instruction hostapi.Instruction) hostapi.Answer {
	switch instruction.Type {
	case "write_keys":
		return replyTo(instruction, session.WriteKeys)
	case "resize":
		return replyTo(instruction, session.Resize)
	case "stream":
		return replyTo(instruction, session.Stream)
	case "snapshot":
		return replyWithoutPayload(instruction, session.Snapshot)
	case "signal":
		return replyTo(instruction, session.Signal)
	case "stop":
		return replyTo(instruction, session.Stop)
	case "open_private":
		return replyTo(instruction, session.OpenPrivate)
	case "close_private":
		return replyWithoutPayload(instruction, session.ClosePrivate)
	case "write_private":
		return replyTo(instruction, func(_ hostapi.PrivateWrite) (hostapi.Empty, error) {
			return writePrivate(link, session)
		})
	default:
		return hostapi.RefusedFor(instruction, hostapi.UnknownInstruction, "the terminal does not carry out "+instruction.Type, nil)
	}
}

func replyTo[T, R any](instruction hostapi.Instruction, handle func(T) (R, error)) hostapi.Answer {
	payload, err := hostapi.DecodePayload[T](instruction)
	if err != nil {
		return hostapi.ReplyWith(instruction, hostapi.Empty{}, err)
	}
	reply, err := handle(payload)
	return hostapi.ReplyWith(instruction, reply, err)
}

func replyWithoutPayload(instruction hostapi.Instruction, handle func() (hostapi.Empty, error)) hostapi.Answer {
	return replyTo(instruction, func(_ struct{}) (hostapi.Empty, error) { return handle() })
}

func writePrivate(link *hostapi.TerminalLink, session *terminal.Session) (hostapi.Empty, error) {
	message, body, err := link.Receive()
	if err != nil {
		return hostapi.Empty{}, err
	}
	if message != hostapi.LinkPrivate {
		return hostapi.Empty{}, hostapi.RefusalError{Refusal: hostapi.Unsafe, Reason: "the private write has no value"}
	}
	value, err := hostapi.ReadWirePayload[hostapi.PrivateValue](body)
	if err != nil {
		// A failure in the private value envelope must not return its content.
		return hostapi.Empty{}, hostapi.RefusalError{Refusal: hostapi.Unsafe, Reason: "the private value is malformed"}
	}
	return session.WritePrivate([]byte(value.Value))
}
