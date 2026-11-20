<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Agents\Values\Operation;
use App\Hooks\Actions\CheckProtectedResources;
use App\Hooks\Actions\RecordProgramFailure;
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
use App\Hooks\Inputs\FailureDetails;
use App\Hooks\Inputs\FileChange;
use App\Hooks\Inputs\FileChanges;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\ProgramToolInput;
use App\Hooks\Inputs\PromptDetails;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\ProtectedFileRead;
use App\Hooks\Inputs\SessionEndDetails;
use App\Hooks\Inputs\SessionEnded;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopDetails;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\ToolRequested;
use App\Hooks\Stack\HookAnswer;
use App\Hooks\Support\ProgramCompatibility;
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
        private RecordProgramFailure $failures,
        private CheckProtectedResources $protection,
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
                'onToolRequested',
                'onStop',
                'onToolFinished',
                'onSessionEnd',
            ],
            RewriteSupport::WithoutApproval,
        );
    }

    public function compatibility(): ProgramCompatibility
    {
        return ProgramCompatibility::pinned(HookProgram::ClaudeCode);
    }

    public function modelArguments(string $model): array
    {
        return HookProgram::ClaudeCode->modelArguments($model);
    }

    public function callFor(HookPayload $hookInput, HookIdentity $hook): ProgramCall
    {
        $event = $hookInput->event()->getOrCall(
            static fn () => throw UnsupportedHook::for(self::PROGRAM, $hookInput->hookEventName),
        );

        return match ($event) {
            HookEvent::SessionStart => $this->startCall($hookInput, $hook),
            HookEvent::UserPromptSubmit => new JudgedCall(
                new PromptSubmitted(
                    $hook,
                    new PromptDetails(
                        $hookInput->nativePromptId() ?? $hook->hookId,
                        $hookInput->promptText(),
                        $hookInput->nativePromptId(),
                    ),
                ),
                fn (HookAnswer $answer) => ProgramReplies::prompt($answer),
            ),
            HookEvent::PreToolUse => $this->toolCall($hookInput, $hook),
            HookEvent::PostToolUse => $this->callsJournalTools($hookInput)
                ? JournalToolCall::finished()
                : JudgedCall::forFinishedTool($hook, $hookInput),
            HookEvent::Stop => new JudgedCall(
                new StopRequested($hook, new StopDetails($hook->hookId, $hookInput->isStopContinuation())),
                fn (HookAnswer $answer) => ProgramReplies::stop($answer),
            ),
            HookEvent::StopFailure => new NotificationCall(
                $hook,
                new FailureDetails(HookProgram::ClaudeCode->value, $hookInput->programFailure()),
                $this->failures,
            ),
            HookEvent::SessionEnd => new JudgedCall(
                new SessionEnded($hook, new SessionEndDetails($hookInput->endReason())),
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
    private function startCall(HookPayload $hookInput, HookIdentity $hook): ProgramCall
    {
        $source = $hookInput->startSource();
        $input = $source === SessionStartSource::Compact
            ? new ContextCompacted($hook, new CompactionDetails($hook->hookId))
            : new SessionStarted($hook, $hookInput->startDetails());

        return new JudgedCall(
            $input,
            fn (HookAnswer $answer) => ProgramReplies::observation(HookEvent::SessionStart, $answer),
        );
    }

    /**
     * After a call to the journal's own tools nothing walks the stack again; after any other tool the journal is told.
     */
    private function callsJournalTools(HookPayload $hookInput): bool
    {
        $tool = ClaudeCodeTool::tryFrom($hookInput->toolNameText());

        return $this->journalTools->names($hookInput->toolNameText())
            || ($tool instanceof ClaudeCodeTool && $tool->discoversJournalTools());
    }

    private function toolCall(HookPayload $hookInput, HookIdentity $hook): ProgramCall
    {
        if ($this->journalTools->names($hookInput->toolNameText())) {
            return JournalToolCall::starting();
        }

        $tool = ClaudeCodeTool::named($hookInput->toolNameText());

        if ($tool->canReadResources()) {
            $this->journalTools->requireJournalResource(self::PROGRAM, $hookInput);
        }

        if ($tool->discoversJournalTools()) {
            return JournalToolCall::starting();
        }

        if ($tool->isFileReader()) {
            if ($this->protection->refusesRead($hook->sessionId, $hookInput->fileRead())) {
                return new UnjudgedCall(ProgramReplies::denyProtected());
            }

            return $this->files->callUnlessRefused(
                $hook,
                FileAccess::Read,
                $hookInput->toolArguments()->presentTexts('file_path', 'path'),
                fn () => $this->judgedTool($hook, $tool->operation($hookInput->toolArguments()), $hookInput),
            );
        }

        if ($tool === ClaudeCodeTool::Bash && $this->refusesCommand($hookInput, $hook)) {
            return new UnjudgedCall(ProgramReplies::denyProtected());
        }

        if ($tool === ClaudeCodeTool::Bash) {
            $original = $hookInput->toolArguments();
            $command = $this->parser->parse($hookInput->argument('command'), ShellDialect::Bash);

            return $this->files->guardShell($hook, $command, fn () => new JudgedCall(
                new ShellCommandRequested($hook, $command),
                fn (HookAnswer $answer) => $this->renderShell($answer, $original),
            ));
        }

        if ($tool->changesFiles()) {
            $original = $hookInput->toolArguments();
            $path = $hookInput->argument('file_path', 'notebook_path');

            if ($this->protection->refusesChange(ProtectedFileRead::resolve($hookInput->workFolder(), $path))) {
                return new UnjudgedCall(ProgramReplies::denyProtected());
            }

            $edit = new FileEditRequested($hook, new FileChanges([new FileChange($path, $tool->fileOperation())]));

            return $this->files->callUnlessRefused(
                $hook,
                FileAccess::Write,
                [$path],
                fn () => new JudgedCall($edit, fn (HookAnswer $answer) => $this->renderShell($answer, $original)),
            );
        }

        if ($tool->keepsOwnTaskList()) {
            return new UnjudgedCall(ProgramReplies::allowTool([]));
        }

        return $this->judgedTool($hook, $tool->operation($hookInput->toolArguments()), $hookInput);
    }

    /**
     * A tool call the walk judges by its declared operation; the ready bottom allows it only when the policy grants it.
     */
    private function judgedTool(HookIdentity $hook, Operation $operation, HookPayload $hookInput): ProgramCall
    {
        $original = $hookInput->toolArguments();

        return new JudgedCall(
            new ToolRequested($hook, $operation),
            fn (HookAnswer $answer) => $this->renderShell($answer, $original),
        );
    }

    private function refusesCommand(HookPayload $hookInput, HookIdentity $hook): bool
    {
        $command = $hookInput->argument('command');

        return $this->protection->refusesCommand($hook->sessionId, $command, $hookInput->workFolder());
    }
}
