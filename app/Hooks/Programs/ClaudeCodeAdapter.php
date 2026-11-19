<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Contracts\ProgramAdapter;
use App\Hooks\Contracts\ProgramCall;
use App\Hooks\Enums\ClaudeCodeTool;
use App\Hooks\Enums\FileAccess;
use App\Hooks\Enums\HookEvent;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Enums\SessionStartSource;
use App\Hooks\Exceptions\UnsupportedHook;
use App\Hooks\Inputs\CompactionDetails;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\FileChange;
use App\Hooks\Inputs\FileChanges;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\PromptDetails;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\SessionEndDetails;
use App\Hooks\Inputs\SessionEnded;
use App\Hooks\Inputs\SessionStartDetails;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopDetails;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Stack\HookAnswer;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Enums\ShellDialect;
use App\Programs\Enums\HookProgram;

/**
 * Reads Claude Code's hook payloads into the journal's inputs and renders its answers as Claude Code replies.
 * A callback or tool it does not map is refused by name. A journal allow never becomes a native approval.
 */
final readonly class ClaudeCodeAdapter implements ProgramAdapter
{
    private const string PROGRAM = 'Claude Code';

    public function __construct(
        private ShellCommandParser $parser,
        private JournalTools $journalTools,
        private GuardedFiles $files,
    ) {}

    public function capabilities(): ProgramCapabilities
    {
        return new ProgramCapabilities(
            self::PROGRAM,
            'Claude Code 2.1.323, hook payloads captured on 2026-11-17',
            [
                'onSessionStart',
                'onPrompt',
                'onCompaction',
                'onShellCommand',
                'onFileEdit',
                'onStop',
                'onToolFinished',
                'onSessionEnd',
            ],
            RewriteSupport::WithoutApproval,
        );
    }

    public function modelArguments(string $model): array
    {
        return HookProgram::ClaudeCode->modelArguments($model);
    }

    public function callFor(HookPayload $payload, HookIdentity $hook): ProgramCall
    {
        $event = $payload->event()
            ?? throw UnsupportedHook::for(self::PROGRAM, $payload->hookEventName);

        return match ($event) {
            HookEvent::SessionStart => $this->startCall($payload, $hook),
            HookEvent::UserPromptSubmit => new JudgedCall(
                new PromptSubmitted(
                    $hook,
                    new PromptDetails(
                        $payload->nativePromptId() ?? $hook->hookId,
                        $payload->promptText(),
                        $payload->nativePromptId(),
                    ),
                ),
                fn (HookAnswer $answer) => ProgramReplies::prompt($answer),
            ),
            HookEvent::PreToolUse => $this->toolCall($payload, $hook),
            HookEvent::PostToolUse => $this->callsJournalTools($payload)
                ? JournalToolCall::finished()
                : JudgedCall::forFinishedTool($hook, $payload),
            HookEvent::Stop => new JudgedCall(
                new StopRequested($hook, new StopDetails($hook->hookId, $payload->isStopContinuation())),
                fn (HookAnswer $answer) => ProgramReplies::stop($answer),
            ),
            HookEvent::SessionEnd => new JudgedCall(
                new SessionEnded($hook, new SessionEndDetails($payload->endReason())),
                fn (HookAnswer $answer) => ProgramReplies::observation(HookEvent::SessionEnd, $answer),
            ),
        };
    }

    public function renderShell(HookAnswer $answer, ProgramToolInput $original): ProgramReply
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
    private function startCall(HookPayload $payload, HookIdentity $hook): ProgramCall
    {
        $source = $payload->startSource();
        $input = $source === SessionStartSource::Compact
            ? new ContextCompacted($hook, new CompactionDetails($hook->hookId))
            : new SessionStarted($hook, new SessionStartDetails($payload->sessionId, $source));

        return new JudgedCall(
            $input,
            fn (HookAnswer $answer) => ProgramReplies::observation(HookEvent::SessionStart, $answer),
        );
    }

    /**
     * After a call to the journal's own tools nothing walks the stack again; after any other tool the journal hears it.
     */
    private function callsJournalTools(HookPayload $payload): bool
    {
        $tool = ClaudeCodeTool::tryFrom($payload->toolNameText());

        return $this->journalTools->names($payload->toolNameText())
            || ($tool instanceof ClaudeCodeTool && $tool->discoversJournalTools());
    }

    private function toolCall(HookPayload $payload, HookIdentity $hook): ProgramCall
    {
        if ($this->journalTools->names($payload->toolNameText())) {
            return JournalToolCall::starting();
        }

        $tool = ClaudeCodeTool::named($payload->toolNameText());

        if ($tool->canReadResources()) {
            $this->journalTools->requireJournalResource(self::PROGRAM, $payload);
        }

        if ($tool->discoversJournalTools()) {
            return JournalToolCall::starting();
        }

        if ($tool === ClaudeCodeTool::Bash) {
            $original = new ProgramToolInput($payload->toolArguments());
            $command = $this->parser->parse($payload->argument('command'), ShellDialect::Bash);

            return new JudgedCall(
                new ShellCommandRequested($hook, $command),
                fn (HookAnswer $answer) => $this->renderShell($answer, $original),
            );
        }

        if ($tool->changesFiles()) {
            $original = new ProgramToolInput($payload->toolArguments());
            $path = $payload->argument('file_path', 'notebook_path');
            $edit = new FileEditRequested($hook, new FileChanges([new FileChange($path, $tool->fileOperation())]));

            return $this->files->guard(
                $hook,
                FileAccess::Write,
                [$path],
                fn () => new JudgedCall($edit, fn (HookAnswer $answer) => $this->renderShell($answer, $original)),
            );
        }

        if ($tool->readsFiles()) {
            return $this->files->guard(
                $hook,
                FileAccess::Read,
                $payload->textArguments('file_path', 'path'),
                fn () => new UnjudgedCall(ProgramReplies::allowTool([])),
            );
        }

        return new UnjudgedCall(ProgramReplies::allowTool([]));
    }
}
