package host

import (
	"os"
	"path/filepath"
	"regexp"
)

// conversationIDPattern is the shape of a native conversation id: nothing that could leave a folder.
var conversationIDPattern = regexp.MustCompile(`^[A-Za-z0-9-]{8,80}$`)

// ResumableConversation answers the conversation a start resumes: the journal's chosen target, but only when its
// transcript is in the start's own account folder for the start's own workspace. A missing or foreign transcript is
// never attached; the start then begins a fresh conversation, which the journal records as not resumed.
func (prepared PreparedStart) ResumableConversation(workFolder string) (string, bool) {
	target := prepared.Claim.ConversationTarget
	if target == "" || !conversationIDPattern.MatchString(target) || prepared.Claim.Directory == "" {
		return "", false
	}
	if hasTranscriptIn(prepared.Claim.Directory, workFolder, target) {
		return target, true
	}
	return "", false
}

// hasTranscriptIn reports whether the account folder holds the conversation's transcript: Claude Code keeps it under
// projects/<the workspace path with separators as dashes>/<id>.jsonl, Codex under sessions/ in a rollout file whose
// name ends with the id.
func hasTranscriptIn(accountFolder string, workFolder string, conversationID string) bool {
	if isRegularFile(filepath.Join(ClaudeProjectFolder(accountFolder, workFolder), conversationID+".jsonl")) {
		return true
	}
	rollouts, err := filepath.Glob(filepath.Join(accountFolder, "sessions", "*", "*", "*", "rollout-*-"+conversationID+".jsonl"))
	if err != nil {
		return false
	}
	for _, rollout := range rollouts {
		if isRegularFile(rollout) {
			return true
		}
	}
	return false
}

func isRegularFile(path string) bool {
	info, err := os.Lstat(path)
	return err == nil && info.Mode().IsRegular()
}
