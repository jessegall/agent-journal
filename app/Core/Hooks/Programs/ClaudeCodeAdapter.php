<?php

declare(strict_types=1);

namespace App\Core\Hooks\Programs;

use App\Core\Hooks\Exceptions\UnreadablePayload;
use App\Core\Hooks\Exceptions\UnsupportedHook;
use App\Core\Hooks\Inputs\CompactionDetails;
use App\Core\Hooks\Inputs\ContextCompacted;
use App\Core\Hooks\Inputs\FileChange;
use App\Core\Hooks\Inputs\FileChanges;
use App\Core\Hooks\Inputs\FileEditRequested;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Inputs\PromptDetails;
use App\Core\Hooks\Inputs\PromptSubmitted;
use App\Core\Hooks\Inputs\SessionEndDetails;
use App\Core\Hooks\Inputs\SessionEnded;
use App\Core\Hooks\Inputs\SessionEndReason;
use App\Core\Hooks\Inputs\SessionStartDetails;
use App\Core\Hooks\Inputs\SessionStarted;
use App\Core\Hooks\Inputs\SessionStartSource;
use App\Core\Hooks\Inputs\ShellCommandParser;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\Inputs\ShellDialect;
use App\Core\Hooks\Inputs\StopDetails;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\Inputs\ToolFinished;
use App\Core\Hooks\Inputs\ToolResult;
use App\Core\Hooks\Stack\HookAnswer;

/**
 * Reads Claude Code's hook payloads into the journal's inputs and renders its answers as Claude Code replies.
 * A callback or tool it does not map is refused by name. A journal allow never becomes a native approval.
 */
final readonly class ClaudeCodeAdapter implements ProgramAdapter
{
    private const PROGRAM = 'Claude Code';

    public function __construct(private ShellCommandParser $parser) {}

    public function capabilities(): ProgramCapabilities
    {
        return new ProgramCapabilities(
            self::PROGRAM,
            'Claude Code hooks reference, checked against the documentation on 2026-11-17',
            ['onSessionStart', 'onPrompt', 'onCompaction', 'onShellCommand', 'onFileEdit', 'onStop', 'onToolFinished', 'onSessionEnd'],
            RewriteSupport::WithoutApproval,
        );
    }

    public function callFor(HookPayload $payload, HookIdentity $hook): NativeCall
    {
        return match ($payload->hookEventName) {
            'SessionStart' => $this->startCall($payload, $hook),
            'UserPromptSubmit' => new JournalCall(
                new PromptSubmitted($hook, new PromptDetails($hook->hookId, $payload->promptText())),
                fn (HookAnswer $answer) => ProgramReplies::prompt($answer),
            ),
            'PreToolUse' => $this->toolCall($payload, $hook),
            'PostToolUse' => new JournalCall(
                new ToolFinished($hook, new ToolResult($payload->toolNameText(), $payload->toolOutcome())),
                fn (HookAnswer $answer) => ProgramReplies::observation('PostToolUse', $answer),
            ),
            'Stop' => new JournalCall(
                new StopRequested($hook, new StopDetails($hook->hookId, $payload->isStopContinuation())),
                fn (HookAnswer $answer) => ProgramReplies::stop($answer),
            ),
            'SessionEnd' => new JournalCall(
                new SessionEnded($hook, new SessionEndDetails($this->endReason($payload))),
                fn (HookAnswer $answer) => ProgramReplies::observation('SessionEnd', $answer),
            ),
            default => throw UnsupportedHook::for(self::PROGRAM, $payload->hookEventName),
        };
    }

    public function renderShell(HookAnswer $answer, NativeToolInput $original): ProgramReply
    {
        return ProgramReplies::shell($answer, $original, RewriteSupport::WithoutApproval);
    }

    public function renderStop(HookAnswer $answer): ProgramReply
    {
        return ProgramReplies::stop($answer);
    }

    /**
     * A start after a compaction is the compaction itself, identified by this callback's id, which its retries share.
     */
    private function startCall(HookPayload $payload, HookIdentity $hook): NativeCall
    {
        $source = $payload->startSource();
        $input = $source === SessionStartSource::Compact
            ? new ContextCompacted($hook, new CompactionDetails($hook->hookId))
            : new SessionStarted($hook, new SessionStartDetails($payload->sessionId, $source));

        return new JournalCall($input, fn (HookAnswer $answer) => ProgramReplies::observation('SessionStart', $answer));
    }

    private function toolCall(HookPayload $payload, HookIdentity $hook): NativeCall
    {
        $tool = ClaudeCodeTool::named($payload->toolNameText());

        if ($tool === ClaudeCodeTool::Bash) {
            $original = new NativeToolInput($payload->toolArguments());
            $command = $this->parser->parse($payload->argument('command'), ShellDialect::Bash);

            return new JournalCall(new ShellCommandRequested($hook, $command), fn (HookAnswer $answer) => $this->renderShell($answer, $original));
        }

        if ($tool->changesFiles()) {
            $original = new NativeToolInput($payload->toolArguments());
            $path = $payload->argument('file_path', 'notebook_path');
            $edit = new FileEditRequested($hook, new FileChanges([new FileChange($path, $tool->fileOperation())]));

            return new JournalCall($edit, fn (HookAnswer $answer) => $this->renderShell($answer, $original));
        }

        return new UntouchedCall(ProgramReplies::admitTool([]));
    }

    private function endReason(HookPayload $payload): SessionEndReason
    {
        return match ($payload->reasonText()) {
            'clear' => SessionEndReason::Clear,
            'logout' => SessionEndReason::Logout,
            'prompt_input_exit' => SessionEndReason::Exit,
            'other' => SessionEndReason::Other,
            default => throw UnreadablePayload::forValue('reason', $payload->reasonText()),
        };
    }
}
