<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

use App\Domain\Hooks\Inputs\FileChange;
use App\Domain\Hooks\Inputs\FileChanges;
use App\Domain\Hooks\Inputs\FileEditRequested;
use App\Domain\Hooks\Inputs\FileOperation;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\PromptDetails;
use App\Domain\Hooks\Inputs\PromptSubmitted;
use App\Domain\Hooks\Inputs\SessionStartDetails;
use App\Domain\Hooks\Inputs\SessionStarted;
use App\Domain\Hooks\Inputs\ShellCommandParser;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Inputs\ShellDialect;
use App\Domain\Hooks\Inputs\StopDetails;
use App\Domain\Hooks\Inputs\StopRequested;
use App\Domain\Hooks\Inputs\ToolFinished;
use App\Domain\Hooks\Inputs\ToolResult;
use App\Domain\Hooks\Stack\HookAnswer;

/**
 * Reads Codex's hook payloads into the journal's inputs and renders its answers as Codex replies. Codex takes a
 * rewritten command only with a native allow, which the journal never sends, so a rewrite is refused with the journal run alternative.
 */
final readonly class CodexAdapter implements ProgramAdapter
{
    private const PROGRAM = 'Codex';

    private const PATCH_FILE_LINE = '/^\*\*\* (Add|Update|Delete) File: (.+)$/m';

    public function __construct(private ShellCommandParser $parser) {}

    public function capabilities(): ProgramCapabilities
    {
        return new ProgramCapabilities(
            self::PROGRAM,
            'Codex hooks reference, checked against the documentation on 2026-11-17',
            ['onSessionStart', 'onPrompt', 'onShellCommand', 'onFileEdit', 'onStop', 'onToolFinished'],
            RewriteSupport::NeedsApproval,
        );
    }

    public function callFor(HookPayload $payload, HookIdentity $hook): NativeCall
    {
        return match ($payload->hookEventName) {
            'SessionStart' => new JournalCall(
                new SessionStarted($hook, new SessionStartDetails($payload->sessionId, $payload->startSource())),
                fn (HookAnswer $answer) => ProgramReplies::observation('SessionStart', $answer),
            ),
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
            default => throw UnsupportedHook::for(self::PROGRAM, $payload->hookEventName),
        };
    }

    public function renderShell(HookAnswer $answer, NativeToolInput $original): ProgramReply
    {
        return ProgramReplies::shell($answer, $original, RewriteSupport::NeedsApproval);
    }

    public function renderStop(HookAnswer $answer): ProgramReply
    {
        return ProgramReplies::stop($answer);
    }

    private function toolCall(HookPayload $payload, HookIdentity $hook): NativeCall
    {
        $tool = CodexTool::named($payload->toolNameText());
        $original = new NativeToolInput($payload->toolArguments());

        if ($tool->isShell()) {
            $command = $this->parser->parse($this->shellLine($payload), ShellDialect::Bash);

            return new JournalCall(new ShellCommandRequested($hook, $command), fn (HookAnswer $answer) => $this->renderShell($answer, $original));
        }

        $edit = new FileEditRequested($hook, $this->patchChanges($payload->argument('input', 'patch')));

        return new JournalCall($edit, fn (HookAnswer $answer) => $this->renderShell($answer, $original));
    }

    /**
     * The shell line of a call: given as text, or as an argument list such as bash -lc with the line last.
     */
    private function shellLine(HookPayload $payload): string
    {
        $command = $payload->toolArguments()['command'] ?? null;

        if (is_string($command)) {
            return $command;
        }

        if (! is_array($command) || $command === []) {
            throw UnreadablePayload::missing('command');
        }

        $words = array_values(array_map(strval(...), $command));

        if (count($words) === 3 && in_array($words[0], ['bash', 'sh', 'zsh'], true) && in_array($words[1], ['-c', '-lc'], true)) {
            return $words[2];
        }

        return implode(' ', array_map(escapeshellarg(...), $words));
    }

    /**
     * Every file a patch adds, updates or deletes, in the order the patch names them.
     */
    private function patchChanges(string $patch): FileChanges
    {
        preg_match_all(self::PATCH_FILE_LINE, $patch, $matches, PREG_SET_ORDER);

        if ($matches === []) {
            throw UnreadablePayload::forValue('patch', 'without a file');
        }

        return new FileChanges(array_map(
            fn (array $match) => new FileChange(trim($match[2]), FileOperation::fromPatchAction($match[1])),
            $matches,
        ));
    }
}
