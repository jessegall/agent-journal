package contracts

import "testing"

func TestPromptOfKeepsThePartOrderAndNamesAnAttachmentByItsIdOnly(t *testing.T) {
	parts := []MessagePart{
		{Type: MessagePartText, Text: "Read this:"},
		{Type: MessagePartAttachment, AttachmentID: "01JATTACHMENT", Digest: "abc", Label: "notes.md"},
		{Type: MessagePartText, Text: "Thanks."},
	}

	want := "Read this:\n\n" +
		"Attachment \"notes.md\": read it with the attachments_read tool, attachment_id 01JATTACHMENT.\n\n" +
		"Thanks."
	if got := PromptOf(parts); got != want {
		t.Fatalf("PromptOf = %q, want %q", got, want)
	}
}

func TestPromptOfAnAttachmentOnlyDeliveryIsItsReference(t *testing.T) {
	parts := []MessagePart{{Type: MessagePartAttachment, AttachmentID: "01JONLY", Label: "plan.txt"}}

	want := "Attachment \"plan.txt\": read it with the attachments_read tool, attachment_id 01JONLY."
	if got := PromptOf(parts); got != want {
		t.Fatalf("PromptOf = %q, want %q", got, want)
	}
}
