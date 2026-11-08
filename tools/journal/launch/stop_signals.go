package launch

import (
	"os"
	"os/signal"
	"syscall"
)

// StopSignals are the signals that end a launcher from outside: a closed terminal and a kill.
var StopSignals = []os.Signal{syscall.SIGHUP, syscall.SIGTERM}

// EndOnStopSignals ends the launch when it is hung up or terminated: it stops every program it holds as a normal end
// does, so each is reported as ended by the launch and can be resumed, closes the launch's socket, and exits.
func EndOnStopSignals(inputs *TerminalInputs, closeSocket func(), exit func(code int)) {
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, StopSignals...)
	go endOnSignal(signals, inputs, closeSocket, exit)
}

func endOnSignal(signals <-chan os.Signal, inputs *TerminalInputs, closeSocket func(), exit func(code int)) {
	received := <-signals
	inputs.StopAll()
	closeSocket()
	code := 1
	if number, ok := received.(syscall.Signal); ok {
		code = 128 + int(number)
	}
	exit(code)
}
