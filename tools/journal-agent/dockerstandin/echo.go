package dockerstandin

import (
	"bufio"
	"bytes"
	"context"
	"fmt"
	"io"
)

// EchoPrompt is what the echo program prints when it waits for a line.
const EchoPrompt = "> "

// EchoCrash is the line that makes the echo program crash, so a test sees a crashed container healed.
const EchoCrash = "crash"

// EchoProgram prints a prompt, reads a line and prints it back as its reply, until its input ends or it is stopped:
// the smallest program a driver can paste into and read an answer from. It draws its prompt again each time its
// terminal is given a size, as a real program repaints, and the line EchoCrash ends it with code 1.
func EchoProgram(ctx context.Context, container *Container, input io.Reader, output io.Writer) int {
	lines := make(chan string)
	go func() {
		scanner := bufio.NewScanner(input)
		scanner.Split(typedLines)
		for scanner.Scan() {
			lines <- scanner.Text()
		}
		close(lines)
	}()
	fmt.Fprint(output, EchoPrompt)
	for {
		select {
		case <-ctx.Done():
			return 0
		case <-container.Resized():
			fmt.Fprint(output, "\r"+EchoPrompt)
		case line, open := <-lines:
			if !open {
				return 0
			}
			if line == EchoCrash {
				return 1
			}
			fmt.Fprintf(output, "\r\necho: %s\r\n%s", line, EchoPrompt)
		}
	}
}

// typedLines splits what is typed into lines at Enter, a carriage return as a terminal sends it, or at a newline.
func typedLines(data []byte, atEOF bool) (int, []byte, error) {
	if index := bytes.IndexAny(data, "\r\n"); index >= 0 {
		return index + 1, data[:index], nil
	}
	if atEOF && len(data) > 0 {
		return len(data), data, nil
	}
	return 0, nil, nil
}
