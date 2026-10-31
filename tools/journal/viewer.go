package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
)

// ViewerAnswer is what the server answers when asked for a viewer key: the key with the environment it opens, or
// why none is given.
type ViewerAnswer struct {
	Key         string `json:"key"`
	Environment string `json:"environment"`
	Error       string `json:"error"`
}

// ViewerHealth is the part of the server's health answer the viewer link needs: the port the viewer listens on.
type ViewerHealth struct {
	ViewerPort int `json:"viewer_port"`
}

// ViewerLink asks the running server for a one-time login key for the person who runs the line, the way a
// command line's caller is found, and prints the link that opens the viewer with it on the environment of the
// folder it runs in; an agent gets no key.
func ViewerLink(client *http.Client, request CliRequest, stdout, stderr io.Writer) int {
	body, err := json.Marshal(map[string]any{"variables": request.Variables, "folder": request.Folder})
	if err != nil {
		fmt.Fprintf(stderr, "the viewer key could not be asked: %v\n", err)
		return ErrorCode
	}
	var answer ViewerAnswer
	if err := postJSON(client, "http://journal/viewer/key", body, &answer); err != nil || answer.Key == "" {
		fmt.Fprintf(stderr, "no viewer key: %s%v\n", answer.Error, errorText(err))
		return ErrorCode
	}
	var health ViewerHealth
	if err := getJSON(client, "http://journal/health", &health); err != nil || health.ViewerPort == 0 {
		fmt.Fprintf(stderr, "the viewer's port is not known: %v\n", errorText(err))
		return ErrorCode
	}
	link := fmt.Sprintf("http://127.0.0.1:%d/?key=%s", health.ViewerPort, url.QueryEscape(answer.Key))
	if answer.Environment != "" {
		link += "&environment=" + url.QueryEscape(answer.Environment)
	}
	fmt.Fprintln(stdout, link)
	return SuccessCode
}

func postJSON(client *http.Client, address string, body []byte, target any) error {
	response, err := client.Post(address, "application/json", bytes.NewReader(body))
	if err != nil {
		return err
	}
	defer response.Body.Close()
	return json.NewDecoder(response.Body).Decode(target)
}

func getJSON(client *http.Client, address string, target any) error {
	response, err := client.Get(address)
	if err != nil {
		return err
	}
	defer response.Body.Close()
	return json.NewDecoder(response.Body).Decode(target)
}

func errorText(err error) string {
	if err == nil {
		return ""
	}
	return err.Error()
}
