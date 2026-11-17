<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Programs;

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
use App\Domain\Hooks\Inputs\ToolOutcome;
use App\Domain\Hooks\Inputs\ToolResult;
use App\Domain\Hooks\Stack\HookAnswer;
use Spatie\LaravelData\Optional;

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
            ['onSessionStart', 'onPrompt', 'onShellCommand', 'onFileEdit', 'onStop', 'onToolFinished', 'onSessionEnd'],
            RewriteSupport::WithoutApproval,
        );
    }

    public function callFor(ClaudeCodePayload $payload, HookIdentity $hook): NativeCall
    {
        return match ($payload->hookEventName) {
            'SessionStart' => new JournalCall(
                new SessionStarted($hook, new SessionStartDetails($payload->sessionId, $this->startSource($payload))),
                fn (HookAnswer $answer) => ProgramReplies::observation('SessionStart', $answer),
            ),
            'UserPromptSubmit' => new JournalCall(
                new PromptSubmitted($hook, new PromptDetails($hook->hookId, $this->field($payload->prompt, 'prompt'))),
                fn (HookAnswer $answer) => ProgramReplies::prompt($answer),
            ),
            'PreToolUse' => $this->toolCall($payload, $hook),
            'PostToolUse' => new JournalCall(
                new ToolFinished($hook, new ToolResult($this->field($payload->toolName, 'tool_name'), $this->outcome($payload))),
                fn (HookAnswer $answer) => ProgramReplies::observation('PostToolUse', $answer),
            ),
            'Stop' => new JournalCall(
                new StopRequested($hook, new StopDetails($hook->hookId, $payload->stopHookActive === true)),
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

    private function toolCall(ClaudeCodePayload $payload, HookIdentity $hook): NativeCall
    {
        $tool = ClaudeCodeTool::named($this->field($payload->toolName, 'tool_name'));
        $arguments = $payload->toolInput instanceof Optional ? [] : $payload->toolInput;
        $original = new NativeToolInput($arguments);

        if ($tool === ClaudeCodeTool::Bash) {
            $command = $this->parser->parse($this->argument($arguments, 'command'), ShellDialect::Bash);

            return new JournalCall(new ShellCommandRequested($hook, $command), fn (HookAnswer $answer) => $this->renderShell($answer, $original));
        }

        if ($tool->changesFiles()) {
            $path = $this->argument($arguments, 'file_path', 'notebook_path');
            $edit = new FileEditRequested($hook, new FileChanges([new FileChange($path, $tool->fileOperation())]));

            return new JournalCall($edit, fn (HookAnswer $answer) => $this->renderShell($answer, $original));
        }

        return new UntouchedCall(ProgramReplies::admitTool([]));
    }

    private function startSource(ClaudeCodePayload $payload): SessionStartSource
    {
        $source = $this->field($payload->source, 'source');

        return SessionStartSource::tryFrom($source) ?? throw UnsupportedHook::forValue(self::PROGRAM, 'source', $source);
    }

    private function endReason(ClaudeCodePayload $payload): SessionEndReason
    {
        return match ($this->field($payload->reason, 'reason')) {
            'clear' => SessionEndReason::Clear,
            'logout' => SessionEndReason::Logout,
            'prompt_input_exit' => SessionEndReason::Exit,
            'other' => SessionEndReason::Other,
            default => throw UnsupportedHook::forValue(self::PROGRAM, 'reason', $this->field($payload->reason, 'reason')),
        };
    }

    private function outcome(ClaudeCodePayload $payload): ToolOutcome
    {
        $response = $payload->toolResponse instanceof Optional ? [] : $payload->toolResponse;

        return ($response['is_error'] ?? false) === true ? ToolOutcome::Failed : ToolOutcome::Succeeded;
    }

    /**
     * @param  array<string, mixed>  $arguments
     */
    private function argument(array $arguments, string ...$names): string
    {
        foreach ($names as $name) {
            if (is_string($arguments[$name] ?? null)) {
                return $arguments[$name];
            }
        }

        throw UnsupportedHook::forValue(self::PROGRAM, implode(' or ', $names), 'missing');
    }

    private function field(string|Optional $value, string $name): string
    {
        return $value instanceof Optional ? throw UnsupportedHook::forValue(self::PROGRAM, $name, 'missing') : $value;
    }
}
