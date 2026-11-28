<?php

declare(strict_types=1);

namespace App\Agents\Drivers\ClaudeCode;

use App\Actors\Contracts\AgentTexts;
use App\Agents\CheckProtectedResources;
use App\Agents\Drivers\Capabilities\DriverCapabilities;
use App\Agents\Drivers\ClaudeCode\Enums\ClaudeCodeTool;
use App\Agents\Drivers\Contracts\DriverAdapter;
use App\Agents\Drivers\Contracts\DriverCall;
use App\Agents\Drivers\Contracts\PinnedBuilds;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Enums\RewriteSupport;
use App\Agents\Drivers\Enums\ToolAllowance;
use App\Agents\Drivers\Hooks\DriverReplies;
use App\Agents\Drivers\Hooks\DriverReply;
use App\Agents\Drivers\Hooks\GuardedFiles;
use App\Agents\Drivers\Hooks\HookPayload;
use App\Agents\Drivers\Hooks\JournalToolCall;
use App\Agents\Drivers\Hooks\JournalTools;
use App\Agents\Drivers\Hooks\JudgedCall;
use App\Agents\Drivers\Hooks\NativeBackgrounding;
use App\Agents\Drivers\Hooks\NotificationCall;
use App\Agents\Drivers\Hooks\UnjudgedCall;
use App\Agents\Inputs\FailureDetails;
use App\Agents\Inputs\Values\CompactionDetails;
use App\Agents\Inputs\Values\FileChange;
use App\Agents\Inputs\Values\FileChanges;
use App\Agents\Inputs\Values\PromptDetails;
use App\Agents\Inputs\Values\SessionEndDetails;
use App\Agents\Inputs\Values\StopDetails;
use App\Agents\RecordDriverFailure;
use App\Exceptions\UnsupportedHook;
use App\Files\Enums\FileAccess;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Enums\HookEvent;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Enums\ShellDialect;
use App\Stacks\HookAnswer;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\NamedReadPaths;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolRequested;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Values\Operation;

/**
 * Reads Claude Code's hook payloads into the journal's inputs and renders its answers as Claude Code replies.
 * A callback or tool it does not map is refused by name. A call the journal admits is answered allow, so the driver
 * asks no user.
 */
final readonly class ClaudeCodeAdapter implements DriverAdapter
{
    private const string DRIVER = 'Claude Code';

    private const ToolAllowance ALLOWANCE = ToolAllowance::AllowDecision;

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
        private PinnedBuilds $builds,
        private ShellCommandParser $parser,
        private JournalTools $journalTools,
        private GuardedFiles $files,
        private RecordDriverFailure $failures,
        private CheckProtectedResources $protection,
        private AgentTexts $texts,
        private NativeBackgrounding $backgrounding,
    ) {}

    public static function hookProtocol(): string
    {
        return DefaultDrivers::CLAUDE_CODE;
    }

    public function journalToolRules(): array
    {
        return ['mcp__journal__*'];
    }

    public function hookCommand(): string
    {
        return 'journal-hook '.self::hookProtocol();
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

    public static function nativeEvents(): array
    {
        return self::NATIVE_EVENTS;
    }

    public static function nativeChildTools(): array
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
        $driver = DefaultDrivers::CLAUDE_CODE;

        return DriverCompatibility::pinned($driver, $this->builds->versionOf($driver));
    }

    public function callFor(HookPayload $hookInput, HookIdentity $hook): DriverCall
    {
        $event = $hookInput->event()->getOrCall(
            UnsupportedHook::throwing()->for(self::DRIVER, $hookInput->hookEventName),
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
                fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::prompt($answer, $texts),
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
                fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::stop($answer, $texts),
            ),
            HookEvent::StopFailure => new NotificationCall(
                $hook,
                new FailureDetails(DefaultDrivers::CLAUDE_CODE, $hookInput->driverFailure()),
                $this->failures,
            ),
            HookEvent::SessionEnd => new JudgedCall(
                new SessionEnded($hook, new SessionEndDetails($hookInput->endReason())),
                fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::observation(
                    HookEvent::SessionEnd,
                    $answer,
                    $texts,
                ),
            ),
        };
    }

    public function renderShell(HookAnswer $answer, DriverToolInput $original, AgentTexts $texts): DriverReply
    {
        return DriverReplies::shell($answer, $original, RewriteSupport::WithoutApproval, self::ALLOWANCE, $texts);
    }

    public function renderStop(HookAnswer $answer, AgentTexts $texts): DriverReply
    {
        return DriverReplies::stop($answer, $texts);
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
            fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::observation(
                HookEvent::SessionStart,
                $answer,
                $texts,
            ),
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
        $journalCall = JournalToolCall::starting(self::ALLOWANCE);

        if ($this->journalTools->names($hookInput->toolNameText())) {
            return $journalCall;
        }

        $tool = ClaudeCodeTool::named($hookInput->toolNameText());

        if ($tool->canReadResources()) {
            $this->journalTools->requireJournalResource(self::DRIVER, $hookInput);
        }

        if ($tool->discoversJournalTools()) {
            return $journalCall;
        }

        if ($tool->isFileReader()) {
            if ($this->protection->refusesRead($hook->sessionId, $hookInput->fileRead())) {
                return $this->protectedRefusal();
            }

            return $this->files->callUnlessRefused(
                $hook,
                FileAccess::Read,
                $hookInput->toolArguments()->presentTexts('file_path', 'path'),
                fn () => $this->judgedTool($hook, $tool->operation($hookInput->toolArguments()), $hookInput),
            );
        }

        if ($tool === ClaudeCodeTool::Bash && $this->refusesCommand($hookInput, $hook)) {
            return $this->protectedRefusal();
        }

        if ($tool === ClaudeCodeTool::Bash) {
            $original = $hookInput->toolArguments();
            $command = $this->parser->parse($hookInput->argument('command'), ShellDialect::Bash);

            // Bash's own run_in_background starts a shell the journal never sees, as a backgrounding line does.
            if ($original->isSet('run_in_background') || $this->backgrounding->isInLine($command)) {
                return $this->backgrounding->refusal();
            }

            return $this->files->guardShell($hook, $command, fn () => new JudgedCall(
                new ShellCommandRequested($hook, $command),
                fn (HookAnswer $answer, AgentTexts $texts) => $this->renderShell($answer, $original, $texts),
            ));
        }

        if ($tool->changesFiles()) {
            $original = $hookInput->toolArguments();
            $path = $hookInput->argument('file_path', 'notebook_path');

            if ($this->protection->refusesChange(NamedReadPaths::resolve($hookInput->workFolder(), $path))) {
                return $this->protectedRefusal();
            }

            $edit = new FileEditRequested($hook, new FileChanges([new FileChange($path, $tool->fileOperation())]));

            return $this->files->callUnlessRefused(
                $hook,
                FileAccess::Write,
                [$path],
                fn () => new JudgedCall(
                    $edit,
                    fn (HookAnswer $answer, AgentTexts $texts) => $this->renderShell($answer, $original, $texts),
                ),
            );
        }

        if ($tool->keepsOwnTaskList()) {
            return new UnjudgedCall(DriverReplies::allowTool([], self::ALLOWANCE));
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
            fn (HookAnswer $answer, AgentTexts $texts) => $this->renderShell($answer, $original, $texts),
        );
    }

    private function refusesCommand(HookPayload $hookInput, HookIdentity $hook): bool
    {
        $command = $hookInput->argument('command');

        return $this->protection->refusesCommand($hook->sessionId, $command, $hookInput->workFolder());
    }

    /**
     * The refusal of a call that reaches a saved account's sign-in, settings or another session's history.
     */
    private function protectedRefusal(): DriverCall
    {
        return new UnjudgedCall(DriverReplies::denyProtected($this->texts));
    }
}
