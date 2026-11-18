<?php

declare(strict_types=1);

namespace App\Hooks\Programs;

use App\Hooks\Contracts\ProgramAdapter;
use App\Hooks\Contracts\ProgramCall;
use App\Hooks\Contracts\ShellCommandParser;
use App\Hooks\Enums\CodexTool;
use App\Hooks\Enums\FileOperation;
use App\Hooks\Enums\RewriteSupport;
use App\Hooks\Enums\ShellDialect;
use App\Hooks\Exceptions\UnreadablePayload;
use App\Hooks\Exceptions\UnsupportedHook;
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
use App\Hooks\Inputs\ToolFinished;
use App\Hooks\Inputs\ToolResult;
use App\Hooks\Stack\HookAnswer;

/**
 * Reads Codex's hook payloads into the journal's inputs and renders its answers as Codex replies. Codex takes a
 * rewritten command only with a native allow, which the journal never sends, so a rewrite is refused with the journal run alternative.
 */
final readonly class CodexAdapter implements ProgramAdapter
{
    private const string PROGRAM = 'Codex';

    private const string PATCH_FILE_LINE = '/^\*\*\* (Add|Update|Delete) File: (.+)$/m';

    public function __construct(private ShellCommandParser $parser) {}

    public function capabilities(): ProgramCapabilities
    {
        return new ProgramCapabilities(
            self::PROGRAM,
            'Codex 0.165.0, hook payloads captured on 2026-11-17',
            ['onSessionStart', 'onPrompt', 'onShellCommand', 'onFileEdit', 'onStop', 'onToolFinished', 'onSessionEnd'],
            RewriteSupport::NeedsApproval,
        );
    }

    public function callFor(HookPayload $payload, HookIdentity $hook): ProgramCall
    {
        return match ($payload->hookEventName) {
            'SessionStart' => new JudgedCall(
                new SessionStarted($hook, new SessionStartDetails($payload->sessionId, $payload->startSource())),
                fn (HookAnswer $answer) => ProgramReplies::observation('SessionStart', $answer),
            ),
            'UserPromptSubmit' => new JudgedCall(
                new PromptSubmitted($hook, new PromptDetails($payload->nativePromptId() ?? $hook->hookId, $payload->promptText())),
                fn (HookAnswer $answer) => ProgramReplies::prompt($answer),
            ),
            'PreToolUse' => $this->toolCall($payload, $hook),
            'PostToolUse' => new JudgedCall(
                new ToolFinished($hook, new ToolResult($payload->toolNameText(), $payload->toolOutcome())),
                fn (HookAnswer $answer) => ProgramReplies::observation('PostToolUse', $answer),
            ),
            'Stop' => new JudgedCall(
                new StopRequested($hook, new StopDetails($hook->hookId, $payload->isStopContinuation())),
                fn (HookAnswer $answer) => ProgramReplies::stop($answer),
            ),
            'SessionEnd' => new JudgedCall(
                new SessionEnded($hook, new SessionEndDetails($payload->endReason())),
                fn (HookAnswer $answer) => ProgramReplies::observation('SessionEnd', $answer),
            ),
            default => throw UnsupportedHook::for(self::PROGRAM, $payload->hookEventName),
        };
    }

    public function renderShell(HookAnswer $answer, ProgramToolInput $original): ProgramReply
    {
        return ProgramReplies::shell($answer, $original, RewriteSupport::NeedsApproval);
    }

    public function renderStop(HookAnswer $answer): ProgramReply
    {
        return ProgramReplies::stop($answer);
    }

    private function toolCall(HookPayload $payload, HookIdentity $hook): ProgramCall
    {
        $tool = CodexTool::named($payload->toolNameText());
        $original = new ProgramToolInput($payload->toolArguments());

        if ($tool->isShell()) {
            $command = $this->parser->parse($payload->argument('command'), ShellDialect::Bash);

            return new JudgedCall(new ShellCommandRequested($hook, $command), fn (HookAnswer $answer) => $this->renderShell($answer, $original));
        }

        $edit = new FileEditRequested($hook, $this->patchChanges($payload->argument('command')));

        return new JudgedCall($edit, fn (HookAnswer $answer) => $this->renderShell($answer, $original));
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
