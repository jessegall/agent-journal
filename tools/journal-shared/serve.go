package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"net/http"
	"os"
)

// defaultListen keeps a new server reachable from its own machine only, until someone names another address.
const defaultListen = "127.0.0.1:8740"

// kinds are the kinds of item the server holds.
var kinds = []string{"doc", "sequence", "check"}

type info struct {
	Protocol int      `json:"protocol"`
	Kinds    []string `json:"kinds"`
}

func serve(args []string) int {
	flags := flag.NewFlagSet("serve", flag.ContinueOnError)
	listen := flags.String("listen", defaultListen, "the host:port to listen on")
	if err := flags.Parse(args); err != nil {
		return 2
	}
	if err := http.ListenAndServe(*listen, handler()); err != nil {
		fmt.Fprintln(os.Stderr, "journal-shared: "+err.Error())
		return 1
	}
	return 0
}

func handler() http.Handler {
	routes := http.NewServeMux()
	routes.HandleFunc("GET /info", answerInfo)
	return routes
}

func answerInfo(response http.ResponseWriter, _ *http.Request) {
	response.Header().Set("Content-Type", "application/json")
	json.NewEncoder(response).Encode(info{Protocol: protocol, Kinds: kinds})
}
