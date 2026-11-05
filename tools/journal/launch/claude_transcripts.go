package launch

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strings"
	"time"
)

// ConversationsShown is how many past conversations the boot menu offers.
const ConversationsShown = 10

var slugCharacters = regexp.MustCompile(`[^A-Za-z0-9]`)

// ClaudeTranscripts reads the conversations Claude Code keeps for a folder under ~/.claude/projects: whether one is
// still kept, the title Claude Code gave it and when it was last written.
type ClaudeTranscripts struct {
	Home string
}

type titleLine struct {
	Type        string `json:"type"`
	AITitle     string `json:"aiTitle"`
	CustomTitle string `json:"customTitle"`
}

// Titled gives the conversations Claude Code still keeps for the folder, each with its title and last write,
// newest first and at most ConversationsShown; a folder Claude Code keeps nothing for gives them back as they are.
func (transcripts ClaudeTranscripts) Titled(folder string, conversations []Conversation) []Conversation {
	projectFolder := filepath.Join(transcripts.Home, ".claude", "projects", slugCharacters.ReplaceAllString(folder, "-"))
	if _, err := os.Stat(projectFolder); err != nil {
		return limited(conversations)
	}
	kept := []Conversation{}
	for _, conversation := range conversations {
		path := filepath.Join(projectFolder, conversation.Session+".jsonl")
		fileInfo, err := os.Stat(path)
		if err != nil {
			continue
		}
		conversation.Title, conversation.ModifiedAt = transcriptTitle(path), fileInfo.ModTime()
		kept = append(kept, conversation)
	}
	sort.SliceStable(kept, func(first, second int) bool { return kept[first].ModifiedAt.After(kept[second].ModifiedAt) })
	return limited(kept)
}

func limited(conversations []Conversation) []Conversation {
	if len(conversations) > ConversationsShown {
		return conversations[:ConversationsShown]
	}
	return conversations
}

func transcriptTitle(path string) string {
	file, err := os.Open(path)
	if err != nil {
		return ""
	}
	defer file.Close()
	aiTitle, customTitle := "", ""
	scanner := bufio.NewScanner(file)
	scanner.Buffer(make([]byte, 1024*1024), 64*1024*1024)
	for scanner.Scan() {
		line := scanner.Bytes()
		if !strings.Contains(string(line[:min(len(line), 40)]), "title") {
			continue
		}
		var parsed titleLine
		if json.Unmarshal(line, &parsed) != nil {
			continue
		}
		if parsed.CustomTitle != "" {
			customTitle = parsed.CustomTitle
		}
		if parsed.AITitle != "" {
			aiTitle = parsed.AITitle
		}
	}
	if customTitle != "" {
		return customTitle
	}
	return aiTitle
}

// Label is how the boot menu names a conversation: its title and how long ago it was last written, or its
// session when it has no title.
func (conversation Conversation) Label(currentAt time.Time) string {
	name := conversation.Title
	if name == "" {
		name = conversation.Session
	}
	if conversation.ModifiedAt.IsZero() {
		return ConversationPrefix + name
	}
	return fmt.Sprintf("%s%s (%s)", ConversationPrefix, name, age(currentAt.Sub(conversation.ModifiedAt)))
}

func age(elapsed time.Duration) string {
	switch {
	case elapsed < time.Hour:
		return fmt.Sprintf("%d minutes ago", int(elapsed.Minutes()))
	case elapsed < 48*time.Hour:
		return fmt.Sprintf("%d hours ago", int(elapsed.Hours()))
	default:
		return fmt.Sprintf("%d days ago", int(elapsed.Hours()/24))
	}
}
