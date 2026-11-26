package dockerstandin

import (
	"bufio"
	"context"
	"fmt"
	"io"
)

// EchoPrompt is what the echo program prints when it waits for a line.
const EchoPrompt = "> "

// EchoCrash is the line that makes the echo program crash, so a test sees a crashed container healed.
const EchoCrash = "crash"

// EchoProgram prints a prompt, reads a line and prints it back as its reply, until its input ends or it is stopped:
// the smallest program a driver can paste into and read an answer from. The line EchoCrash ends it with code 1.
func EchoProgram(ctx context.Context, _ *Container, input io.Reader, output io.Writer) int {
	lines := bufio.NewScanner(input)
	for {
		fmt.Fprint(output, EchoPrompt)
		if ctx.Err() != nil || !lines.Scan() {
			return 0
		}
		if lines.Text() == EchoCrash {
			return 1
		}
		fmt.Fprintf(output, "echo: %s\r\n", lines.Text())
	}
}
