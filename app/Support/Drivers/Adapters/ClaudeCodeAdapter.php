<?php

declare(strict_types=1);

namespace App\Support\Drivers\Adapters;

use App\Contracts\Processes\ShellCommandParser;
use App\Enums\ContextStartType;
use App\Enums\FileAccess;
use App\Enums\HookEvent;
use App\Enums\RewriteSupport;
use App\Enums\ShellDialect;
use App\Exceptions\UnsupportedHook;
use App\Support\CheckProtectedResources;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\DefaultDrivers;
use App\Support\Drivers\Contracts\DriverAdapter;
use App\Support\Drivers\Contracts\DriverCall;
use App\Support\Drivers\DriverCapabilities;
use App\Support\Drivers\DriverReplies;
use App\Support\Drivers\DriverReply;
use App\Support\Drivers\HookPayload;
use App\Support\Drivers\JournalTools;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\FailureDetails;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\ProtectedFileRead;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolRequested;
use App\Support\Inputs\Values\CompactionDetails;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\FileChange;
use App\Support\Inputs\Values\FileChanges;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\PromptDetails;
use App\Support\Inputs\Values\SessionEndDetails;
use App\Support\Inputs\Values\StopDetails;
use App\Support\RecordDriverFailure;
use App\Support\Stack\HookAnswer;
use App\Support\ToolNames\Enums\ClaudeCodeTool;
use App\Values\Operation;

/**
 * Reads Claude Code's hook payloads into the journal's inputs and renders its answers as Claude Code replies.
 * A callback or tool it does not map is refused by name. A call the journal admits is answered allow, so the driver
 * asks no user.
 */
final readonly class ClaudeCodeAdapter implements DriverAdapter
{
    private const string DRIVER = 'Claude Code';

    /**
     * The tools of each recorded build that start or reach another agent.
     */
    public const array NATIVE_CHILD_TOOLS = [
        'Agent',
        'Task',
        'Workflow',
        'SendMessage',
        'ListAgents',
        'RemoteTrigger',
        'Skill',
    ];

    public const array NATIVE_EVENTS = [
        'SessionStart',
        'UserPromptSubmit',
        'PreToolUse',
        'PostToolUse',
        'Stop',
        'StopFailure',
        'SessionEnd',
    ];

    public function __construct(
        private ShellCommandParser $parser,
        private JournalTools $journalTools,
        private GuardedFiles $files,
        private RecordDriverFailure $failures,
        private CheckProtectedResources $protection,
    ) {}

    public function hookProtocol(): string
    {
        return DefaultDrivers::CLAUDE_CODE;
    }

    public function journalToolRules(): array
    {
        return ['mcp__journal__*'];
    }

    public function hookCommand(): string
    {
        return 'journal-hook '.$this->hookProtocol();
    }

    /**
     * Claude Code writes <session id>.jsonl.
     */
    public function namesTranscriptOf(string $fileName, string $nativeId): bool
    {
        return $fileName === $nativeId.'.jsonl';
    }

    public function keepsOutputsBesideTranscript(): bool
    {
        return true;
    }

    public function nativeEvents(): array
    {
        return self::NATIVE_EVENTS;
    }

    public function nativeChildTools(): array
    {
        return self::NATIVE_CHILD_TOOLS;
    }

    public function capabilities(): DriverCapabilities
    {
        return new DriverCapabilities(
            self::DRIVER,
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

    public function compatibility(): DriverCompatibility
    {
        return DriverCompatibility::pinned(DefaultDrivers::CLAUDE_CODE);
    }

    public function modelArguments(string $model): array
    {
        return ['--model', $model];
    }

    public function callFor(HookPayload $hookInput, HookIdentity $hook): DriverCall
    {
        $event = $hookInput->event()->getOrCall(
            static fn () => throw UnsupportedHook::for(self::DRIVER, $hookInput->hookEventName),
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
                fn (HookAnswer $answer) => DriverReplies::prompt($answer),
            ),
            HookEvent::PreToolUse => $this->toolCall($hookInput, $hook),
            HookEvent::PostToolUse => $this->callsJournalTools($hookInput)
                ? JournalToolCall::finished()
                : JudgedCall::forFinishedTool($hook, $hookInput),
            HookEvent::Stop => new JudgedCall(
                new StopRequested($hook, new StopDetails(
                    $hook->hookId,
                    $hookInput->isAfterRefusedStop(),
                    $hookInput->closingWords(),
                )),
                fn (HookAnswer $answer) => DriverReplies::stop($answer),
            ),
            HookEvent::StopFailure => new NotificationCall(
                $hook,
                new FailureDetails(DefaultDrivers::CLAUDE_CODE, $hookInput->driverFailure()),
                $this->failures,
            ),
            HookEvent::SessionEnd => new JudgedCall(
                new SessionEnded($hook, new SessionEndDetails($hookInput->endReason())),
                fn (HookAnswer $answer) => DriverReplies::observation(HookEvent::SessionEnd, $answer),
            ),
        };
    }

    public function renderShell(HookAnswer $answer, DriverToolInput $original): DriverReply
    {
        return DriverReplies::shell($answer, $original, RewriteSupport::WithoutApproval);
    }

    public function renderStop(HookAnswer $answer): DriverReply
    {
        return DriverReplies::stop($answer);
    }

    /**
     * A start after a compaction is the compaction itself, identified by this callback's id, which its retries share.
     */
    private function startCall(HookPayload $hookInput, HookIdentity $hook): DriverCall
    {
        $source = $hookInput->startSource();

        $input = $source === ContextStartType::Compact
            ? new ContextCompacted($hook, new CompactionDetails($hook->hookId))
            : new SessionStarted($hook, $hookInput->startDetails());

        return new JudgedCall(
            $input,
            fn (HookAnswer $answer) => DriverReplies::observation(HookEvent::SessionStart, $answer),
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

    private function toolCall(HookPayload $hookInput, HookIdentity $hook): DriverCall
    {
        if ($this->journalTools->names($hookInput->toolNameText())) {
            return JournalToolCall::starting();
        }

        $tool = ClaudeCodeTool::named($hookInput->toolNameText());

        if ($tool->canReadResources()) {
            $this->journalTools->requireJournalResource(self::DRIVER, $hookInput);
        }

        if ($tool->discoversJournalTools()) {
            return JournalToolCall::starting();
        }

        if ($tool->isFileReader()) {
            if ($this->protection->refusesRead($hook->sessionId, $hookInput->fileRead())) {
                return new UnjudgedCall(DriverReplies::denyProtected());
            }

            return $this->files->callUnlessRefused(
                $hook,
                FileAccess::Read,
                $hookInput->toolArguments()->presentTexts('file_path', 'path'),
                fn () => $this->judgedTool($hook, $tool->operation($hookInput->toolArguments()), $hookInput),
            );
        }

        if ($tool === ClaudeCodeTool::Bash && $this->refusesCommand($hookInput, $hook)) {
            return new UnjudgedCall(DriverReplies::denyProtected());
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
                return new UnjudgedCall(DriverReplies::denyProtected());
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
            return new UnjudgedCall(DriverReplies::allowTool([]));
        }

        return $this->judgedTool($hook, $tool->operation($hookInput->toolArguments()), $hookInput);
    }

    /**
     * A tool call the walk judges by its declared operation; the ready bottom allows it only when the policy grants it.
     */
    private function judgedTool(HookIdentity $hook, Operation $operation, HookPayload $hookInput): DriverCall
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
