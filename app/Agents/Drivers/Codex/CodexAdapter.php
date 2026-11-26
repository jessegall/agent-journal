<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Codex;

use App\Agents\Drivers\Capabilities\DriverCapabilities;
use App\Agents\Drivers\DefaultDrivers;
use App\Agents\Drivers\Hooks\DriverReplies;
use App\Agents\Drivers\Hooks\DriverReply;
use App\Agents\Drivers\Hooks\GuardedFiles;
use App\Agents\Drivers\Hooks\HookPayload;
use App\Agents\Drivers\Hooks\JournalToolCall;
use App\Agents\Drivers\Hooks\JournalTools;
use App\Agents\Drivers\Hooks\JudgedCall;
use App\Agents\Drivers\Hooks\UnjudgedCall;
use App\Contracts\Actors\AgentTexts;
use App\Contracts\Drivers\DriverAdapter;
use App\Contracts\Drivers\DriverCall;
use App\Contracts\Processes\ShellCommandParser;
use App\Enums\Drivers\CodexTool;
use App\Enums\Drivers\RewriteSupport;
use App\Enums\Files\FileAccess;
use App\Enums\Hooks\HookEvent;
use App\Enums\Processes\ShellDialect;
use App\Exceptions\UnsupportedHook;
use App\Support\CheckProtectedResources;
use App\Support\Compatibility\DriverCompatibility;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\ProtectedFileRead;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\FileChanges;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\PromptDetails;
use App\Support\Inputs\Values\SessionEndDetails;
use App\Support\Inputs\Values\StopDetails;
use App\Support\Stack\HookAnswer;

/**
 * Reads Codex's hook payloads into the journal's inputs and renders its answers as Codex replies. Codex takes a
 * rewritten command only with a native allow, which the journal never sends, so a rewrite is refused with the journal
 * run alternative.
 */
final readonly class CodexAdapter implements DriverAdapter
{
    private const string DRIVER = 'Codex';

    public const array NATIVE_EVENTS = [
        'SessionStart',
        'UserPromptSubmit',
        'PreToolUse',
        'PostToolUse',
        'Stop',
        'SessionEnd',
    ];

    public const array NATIVE_CHILD_TOOLS = [
        'collaboration.spawn_agent',
        'collaboration.wait_agent',
        'collaboration.send_message',
        'collaboration.followup_task',
        'collaboration.interrupt_agent',
        'collaboration.list_agents',
    ];

    public function __construct(
        private ShellCommandParser $parser,
        private JournalTools $journalTools,
        private GuardedFiles $files,
        private CheckProtectedResources $protection,
        private AgentTexts $texts,
    ) {}

    public function hookProtocol(): string
    {
        return DefaultDrivers::CODEX;
    }

    public function journalToolRules(): array
    {
        return [];
    }

    public function hookCommand(): string
    {
        return 'journal-hook '.$this->hookProtocol();
    }

    /**
     * Codex writes rollout-<time>-<session id>.jsonl.
     */
    public function namesTranscriptOf(string $fileName, string $nativeId): bool
    {
        return str_starts_with($fileName, 'rollout-') && str_ends_with($fileName, '-'.$nativeId.'.jsonl');
    }

    /**
     * Codex keeps large tool outputs in the transcript.
     */
    public function keepsOutputsBesideTranscript(): bool
    {
        return false;
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
            'Codex 0.165.0, hook payloads captured on 2026-11-17',
            ['onSessionStart', 'onPrompt', 'onShellCommand', 'onFileEdit', 'onStop', 'onToolFinished', 'onSessionEnd'],
            RewriteSupport::NeedsApproval,
        );
    }

    public function compatibility(): DriverCompatibility
    {
        return DriverCompatibility::pinned(DefaultDrivers::CODEX);
    }

    public function callFor(HookPayload $hookInput, HookIdentity $hook): DriverCall
    {
        $event = $hookInput->event()->getOrCall(
            UnsupportedHook::throwing()->for(self::DRIVER, $hookInput->hookEventName),
        );

        return match ($event) {
            HookEvent::SessionStart => new JudgedCall(
                new SessionStarted($hook, $hookInput->startDetails()),
                fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::observation(
                    HookEvent::SessionStart,
                    $answer,
                    $texts,
                ),
            ),
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
            HookEvent::SessionEnd => new JudgedCall(
                new SessionEnded($hook, new SessionEndDetails($hookInput->endReason())),
                fn (HookAnswer $answer, AgentTexts $texts) => DriverReplies::observation(
                    HookEvent::SessionEnd,
                    $answer,
                    $texts,
                ),
            ),
            HookEvent::StopFailure => throw UnsupportedHook::for(self::DRIVER, $hookInput->hookEventName),
        };
    }

    public function renderShell(HookAnswer $answer, DriverToolInput $original, AgentTexts $texts): DriverReply
    {
        return DriverReplies::shell($answer, $original, RewriteSupport::NeedsApproval, $texts);
    }

    public function renderStop(HookAnswer $answer, AgentTexts $texts): DriverReply
    {
        return DriverReplies::stop($answer, $texts);
    }

    /**
     * After a call to the journal's own tools nothing walks the stack again; after any other tool the journal is told.
     */
    private function callsJournalTools(HookPayload $hookInput): bool
    {
        $tool = CodexTool::tryFrom($hookInput->toolNameText());

        return $this->journalTools->names($hookInput->toolNameText())
            || ($tool instanceof CodexTool && $tool->discoversJournalTools());
    }

    private function toolCall(HookPayload $hookInput, HookIdentity $hook): DriverCall
    {
        if ($this->journalTools->names($hookInput->toolNameText())) {
            return JournalToolCall::starting();
        }

        $tool = CodexTool::named($hookInput->toolNameText());

        if ($tool->canReadResources()) {
            $this->journalTools->requireJournalResource(self::DRIVER, $hookInput);
        }

        if ($tool->discoversJournalTools()) {
            return JournalToolCall::starting();
        }

        $original = $hookInput->toolArguments();
        $folder = $hookInput->workFolder();

        $isRefusedCommand = $tool->isShell()
            && $this->protection->refusesCommand($hook->sessionId, $hookInput->argument('command'), $folder);

        if ($isRefusedCommand) {
            return $this->protectedRefusal();
        }

        if ($tool->isShell()) {
            $command = $this->parser->parse($hookInput->argument('command'), ShellDialect::Bash);

            return $this->files->guardShell($hook, $command, fn () => new JudgedCall(
                new ShellCommandRequested($hook, $command),
                fn (HookAnswer $answer, AgentTexts $texts) => $this->renderShell($answer, $original, $texts),
            ));
        }

        $changes = FileChanges::fromPatch($hookInput->argument('command'));

        foreach ($changes->paths() as $path) {
            if ($this->protection->refusesChange(ProtectedFileRead::resolve($folder, $path))) {
                return $this->protectedRefusal();
            }
        }

        $edit = new FileEditRequested($hook, $changes);

        return $this->files->callUnlessRefused(
            $hook,
            FileAccess::Write,
            $changes->paths(),
            fn () => new JudgedCall(
                $edit,
                fn (HookAnswer $answer, AgentTexts $texts) => $this->renderShell($answer, $original, $texts),
            ),
        );
    }

    /**
     * The refusal of a call that reaches a saved account's sign-in, settings or another session's history.
     */
    private function protectedRefusal(): DriverCall
    {
        return new UnjudgedCall(DriverReplies::denyProtected($this->texts));
    }
}
