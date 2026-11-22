<?php

declare(strict_types=1);

namespace App\Hooks\Drivers\Adapters;

use App\Drivers\Enums\HookDriver;
use App\Hooks\Actions\CheckProtectedResources;
use App\Hooks\Compatibility\DriverCompatibility;
use App\Hooks\Drivers\Contracts\DriverAdapter;
use App\Hooks\Drivers\Contracts\DriverCall;
use App\Hooks\Drivers\DriverCapabilities;
use App\Hooks\Drivers\DriverReplies;
use App\Hooks\Drivers\DriverReply;
use App\Hooks\Drivers\HookPayload;
use App\Hooks\Drivers\JournalTools;
use App\Hooks\Enums\CodexTool;
use App\Hooks\Enums\FileAccess;
use App\Hooks\Enums\FileOperation;
use App\Hooks\Enums\HookEvent;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Exceptions\UnreadablePayload;
use App\Hooks\Exceptions\UnsupportedHook;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\PromptSubmitted;
use App\Hooks\Inputs\ProtectedFileRead;
use App\Hooks\Inputs\SessionEnded;
use App\Hooks\Inputs\SessionStarted;
use App\Hooks\Inputs\ShellCommandRequested;
use App\Hooks\Inputs\StopRequested;
use App\Hooks\Inputs\Values\DriverToolInput;
use App\Hooks\Inputs\Values\FileChange;
use App\Hooks\Inputs\Values\FileChanges;
use App\Hooks\Inputs\Values\HookIdentity;
use App\Hooks\Inputs\Values\PromptDetails;
use App\Hooks\Inputs\Values\SessionEndDetails;
use App\Hooks\Inputs\Values\StopDetails;
use App\Hooks\Stack\HookAnswer;
use App\Processes\Contracts\ShellCommandParser;
use App\Processes\Enums\ShellDialect;

/**
 * Reads Codex's hook payloads into the journal's inputs and renders its answers as Codex replies. Codex takes a
 * rewritten command only with a native allow, which the journal never sends, so a rewrite is refused with the journal
 * run alternative.
 */
final readonly class CodexAdapter implements DriverAdapter
{
    private const string DRIVER = 'Codex';

    public const array NATIVE_EVENTS = ['SessionStart', 'UserPromptSubmit', 'PreToolUse', 'PostToolUse', 'Stop', 'SessionEnd'];

    public const array NATIVE_CHILD_TOOLS = [
        'collaboration.spawn_agent',
        'collaboration.wait_agent',
        'collaboration.send_message',
        'collaboration.followup_task',
        'collaboration.interrupt_agent',
        'collaboration.list_agents',
    ];

    private const string PATCH_FILE_LINE = '/^\*\*\* (Add|Update|Delete) File: (.+)$/m';

    private const string PATCH_MOVED_FILE = '/^\*\*\* Update File: (.+)\n\*\*\* Move to: (.+)$/m';

    public function __construct(
        private ShellCommandParser $parser,
        private JournalTools $journalTools,
        private GuardedFiles $files,
        private CheckProtectedResources $protection,
    ) {}

    public function hookProtocol(): string
    {
        return HookDriver::Codex->value;
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
            [
                'onSessionStart',
                'onPrompt',
                'onShellCommand',
                'onFileEdit',
                'onStop',
                'onToolFinished',
                'onSessionEnd',
            ],
            RewriteSupport::NeedsApproval,
        );
    }

    public function compatibility(): DriverCompatibility
    {
        return DriverCompatibility::pinned(HookDriver::Codex);
    }

    public function modelArguments(string $model): array
    {
        return HookDriver::Codex->modelArguments($model);
    }

    public function callFor(HookPayload $hookInput, HookIdentity $hook): DriverCall
    {
        $event = $hookInput->event()->getOrCall(
            static fn () => throw UnsupportedHook::for(self::DRIVER, $hookInput->hookEventName),
        );

        return match ($event) {
            HookEvent::SessionStart => new JudgedCall(
                new SessionStarted($hook, $hookInput->startDetails()),
                fn (HookAnswer $answer) => DriverReplies::observation(HookEvent::SessionStart, $answer),
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
                fn (HookAnswer $answer) => DriverReplies::prompt($answer),
            ),
            HookEvent::PreToolUse => $this->toolCall($hookInput, $hook),
            HookEvent::PostToolUse => $this->callsJournalTools($hookInput)
                ? JournalToolCall::finished()
                : JudgedCall::forFinishedTool($hook, $hookInput),
            HookEvent::Stop => new JudgedCall(
                new StopRequested($hook, new StopDetails($hook->hookId, $hookInput->isStopContinuation())),
                fn (HookAnswer $answer) => DriverReplies::stop($answer),
            ),
            HookEvent::SessionEnd => new JudgedCall(
                new SessionEnded($hook, new SessionEndDetails($hookInput->endReason())),
                fn (HookAnswer $answer) => DriverReplies::observation(HookEvent::SessionEnd, $answer),
            ),
            HookEvent::StopFailure => throw UnsupportedHook::for(self::DRIVER, $hookInput->hookEventName),
        };
    }

    public function renderShell(HookAnswer $answer, DriverToolInput $original): DriverReply
    {
        return DriverReplies::shell($answer, $original, RewriteSupport::NeedsApproval);
    }

    public function renderStop(HookAnswer $answer): DriverReply
    {
        return DriverReplies::stop($answer);
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
            return new UnjudgedCall(DriverReplies::denyProtected());
        }

        if ($tool->isShell()) {
            $command = $this->parser->parse($hookInput->argument('command'), ShellDialect::Bash);

            return $this->files->guardShell($hook, $command, fn () => new JudgedCall(
                new ShellCommandRequested($hook, $command),
                fn (HookAnswer $answer) => $this->renderShell($answer, $original),
            ));
        }

        $changes = $this->patchChanges($hookInput->argument('command'));

        foreach ($changes->paths() as $path) {
            if ($this->protection->refusesChange(ProtectedFileRead::resolve($folder, $path))) {
                return new UnjudgedCall(DriverReplies::denyProtected());
            }
        }

        $edit = new FileEditRequested($hook, $changes);

        return $this->files->callUnlessRefused(
            $hook,
            FileAccess::Write,
            $changes->paths(),
            fn () => new JudgedCall($edit, fn (HookAnswer $answer) => $this->renderShell($answer, $original)),
        );
    }

    /**
     * Every file a patch adds, updates or deletes, in the order the patch names them; a moved file is deleted at its
     * source and written at its destination.
     */
    private function patchChanges(string $patch): FileChanges
    {
        preg_match_all(self::PATCH_FILE_LINE, $patch, $matches, PREG_SET_ORDER);

        if ($matches === []) {
            throw UnreadablePayload::forValue('patch', 'without a file');
        }

        preg_match_all(self::PATCH_MOVED_FILE, $patch, $moves, PREG_SET_ORDER);
        $movedSources = array_map(fn (array $move) => trim($move[1]), $moves);

        $changes = array_map(
            fn (array $match) => in_array(trim($match[2]), $movedSources, true)
                ? new FileChange(trim($match[2]), FileOperation::Delete)
                : new FileChange(trim($match[2]), FileOperation::fromPatchAction($match[1])),
            $matches,
        );

        $destinations = array_map(fn (array $move) => new FileChange(trim($move[2]), FileOperation::Write), $moves);

        return new FileChanges([...$changes, ...$destinations]);
    }
}
