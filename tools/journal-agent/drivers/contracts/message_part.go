package contracts

import (
	"fmt"
	"strings"
)

// MessagePartType is what one part of a delivery holds: text, or a reference to an attachment the agent reads itself.
type MessagePartType string

const (
	MessagePartText       MessagePartType = "text"
	MessagePartAttachment MessagePartType = "attachment"
)

// AttachmentReadTool is the journal tool an agent reads an attachment with, by its id, a page at a time.
const AttachmentReadTool = "attachments_read"

// MessagePart mirrors App\\Values\\MessagePart: a text, or an attachment named by its id, digest and label.
type MessagePart struct {
	Type         MessagePartType `json:"type"`
	Text         string          `json:"text"`
	AttachmentID string          `json:"attachmentId"`
	Digest       string          `json:"digest"`
	Label        string          `json:"label"`
}

// PromptOf formats the parts into the one prompt every driver hands its program, in their order. An attachment is
// named by its label and id with the tool that reads it; its content and any file path never enter the prompt.
func PromptOf(parts []MessagePart) string {
	lines := make([]string, 0, len(parts))
	for _, part := range parts {
		if part.Type == MessagePartAttachment {
			lines = append(lines, fmt.Sprintf(
				"Attachment %q: read it with the %s tool, attachment_id %s.",
				part.Label, AttachmentReadTool, part.AttachmentID,
			))
			continue
		}
		lines = append(lines, part.Text)
	}
	return strings.Join(lines, "\n\n")
}

// TextParts is a delivery of one text.
func TextParts(text string) []MessagePart {
	return []MessagePart{{Type: MessagePartText, Text: text}}
}
