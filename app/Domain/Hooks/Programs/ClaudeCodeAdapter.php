<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use App\Domain\Hooks\Inputs\CompactionDetails;
use App\Domain\Hooks\Inputs\ContextCompacted;
use App\Domain\Hooks\Inputs\FileChange;
use App\Domain\Hooks\Inputs\FileChanges;
use App\Domain\Hooks\Inputs\FileEditRequested;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\PromptDetails;
use App\Domain\Hooks\Inputs\PromptSubmitted;
use App\Domain\Hooks\Inputs\SessionEndDetails;
use App\Domain\Hooks\Inputs\SessionEnded;
use App\Domain\Hooks\Inputs\SessionEndReason;
use App\Domain\Hooks\Inputs\SessionStartDetails;
use App\Domain\Hooks\Inputs\SessionStarted;
use App\Domain\Hooks\Inputs\SessionStartSource;
use App\Domain\Hooks\Inputs\ShellCommandParser;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Inputs\ShellDialect;
use App\Domain\Hooks\Inputs\StopDetails;
use App\Domain\Hooks\Inputs\StopRequested;
use App\Domain\Hooks\Inputs\ToolFinished;
use App\Domain\Hooks\Inputs\ToolResult;
use App\Domain\Hooks\Stack\HookAnswer;

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
