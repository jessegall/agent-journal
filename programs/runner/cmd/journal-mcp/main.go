// Command journal-mcp is the MCP server a started driver runs on stdio in a session container: it passes each frame
// to the journal as one signed call with the start's grant, and each answer back as one line.
package main

import (
	"context"
	"fmt"
	"os"
	"time"

	"journal-runner/client"
	"journal-runner/mcprelay"
)

func main() {
	grant, granted := client.StartGrantFrom(os.LookupEnv)
	if !granted {
		fmt.Fprintln(os.Stderr, "journal-mcp: this session holds no start grant, so the journal cannot be asked")
		os.Exit(1)
	}

	relay := mcprelay.Relay{Send: sendWith(grant), Output: os.Stdout, Errors: os.Stderr}
	relay.Run(context.Background(), os.Stdin)
}

// sendWith sends a frame to the journal's MCP address, signed as the start's agent.
func sendWith(grant client.StartGrant) mcprelay.Sender {
	return func(ctx context.Context, body []byte, issuedAt time.Time, headers map[string]string) (mcprelay.Answer, error) {
		answer, err := grant.PostAsAgent(ctx, mcprelay.Path, body, issuedAt.Unix(), headers)

		return mcprelay.Answer{Status: answer.Status, Body: answer.Body}, err
	}
}
