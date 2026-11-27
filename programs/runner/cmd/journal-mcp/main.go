// Command journal-mcp is the MCP server a started driver runs on stdio in a session container: it passes each frame
// to the journal as one signed call with the start's grant, and each answer back as one line. Given journal-hook's
// arguments, it also answers the driver's mcp_tool hooks on its hook tool, as journal-hook answers command hooks.
package main

import (
	"context"
	"fmt"
	"os"
	"strings"
	"time"

	"journal-runner/client"
	"journal-runner/hookadapter"
	"journal-runner/mcprelay"
)

func main() {
	grant, granted := client.StartGrantFrom(os.LookupEnv)
	if !granted {
		fmt.Fprintln(os.Stderr, "journal-mcp: this session holds no start grant, so the journal cannot be asked")
		os.Exit(1)
	}
	if len(os.Args) != 1 && len(os.Args) != 1+len(hookadapter.Arguments) {
		fmt.Fprintln(os.Stderr, "usage: journal-mcp [<"+strings.Join(hookadapter.Arguments, "> <")+">]")
		os.Exit(2)
	}

	relay := mcprelay.Relay{Send: sendWith(grant), Output: os.Stdout, Errors: os.Stderr}
	if len(os.Args) == 1+len(hookadapter.Arguments) {
		relay.Hook = hooksOf(grant, os.Args[1], os.Args[2])
	}
	relay.Run(context.Background(), os.Stdin)
}

// sendWith sends a frame to the journal's MCP address, signed as the start's agent.
func sendWith(grant client.StartGrant) mcprelay.Sender {
	return func(ctx context.Context, body []byte, issuedAt time.Time, headers map[string]string) (mcprelay.Answer, error) {
		answer, err := grant.PostAsAgent(ctx, mcprelay.Path, body, issuedAt.Unix(), headers)

		return mcprelay.Answer{Status: answer.Status, Body: answer.Body}, err
	}
}

// hooksOf answers each hook call as journal-hook does in a session container, with a fresh adapter each time, so each
// call reaches the journal as its own.
func hooksOf(grant client.StartGrant, driver string, repliesFile string) mcprelay.HookAnswerer {
	return func(native []byte) hookadapter.Reply {
		return hookadapter.InContainer(grant, driver, repliesFile).Answer(native)
	}
}
