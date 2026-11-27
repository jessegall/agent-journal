<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Agents\Drivers\ClaudeCode\Enums\ClaudeCodeTool;
use App\Agents\Inputs\Values\CompactionDetails;
use App\Agents\Inputs\Values\FileChange;
use App\Agents\Inputs\Values\FileChanges;
use App\Agents\Inputs\Values\PromptDetails;
use App\Agents\Inputs\Values\SessionEndDetails;
use App\Agents\Inputs\Values\SessionStartDetails;
use App\Agents\Inputs\Values\StopDetails;
use App\Agents\Values\CommandPart;
use App\CommandRules\Enums\CommandEffect;
use App\CommandRules\Enums\CommandType;
use App\CommandRules\Enums\ParseOutcome;
use App\Files\Enums\FileOperation;
use App\Hooks\Enums\ContextStartType;
use App\Hooks\Enums\ToolOutcome;
use App\Processes\Enums\ShellDialect;
use App\Sessions\Enums\SessionEndReason;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\ToolResult;
use App\Values\ShellCommand;

/**
 * One input of every hook, for tests that must cover them all.
 */
final class HookInputs
{
    /**
     * The hooks, each by the name of its input in all().
     */
    public const array HOOKS = [
        'session start',
        'prompt',
        'shell command',
        'file edit',
        'tool requested',
        'stop',
        'compaction',
        'tool finished',
        'session end',
    ];

    /**
     * Every hook as a PHPUnit data set named for it. A data set holds only the hook's name: its input is built in
     * the test with of(), as some inputs build Data, which needs the booted app a data provider runs before.
     *
     * @return iterable<string, array{string}>
     */
    public static function dataSets(): iterable
    {
        foreach (self::HOOKS as $hook) {
            yield $hook => [$hook];
        }
    }

    /**
     * The input of the hook of this name.
     */
    public static function of(string $hook): HookInput
    {
        return self::all()[$hook];
    }

    /**
     * @return array<string, HookInput>
     */
    public static function all(): array
    {
        $hook = new HookIdentity('01jd8x0g9m3qz6v4k2t7r5w1ca', '01jd8x0g9m3qz6v4k2t7r5w1cb', 'hook-1', 'digest');

        return [
            'session start' => new SessionStarted(
                $hook,
                new SessionStartDetails('vendor-1', ContextStartType::Start, null),
            ),
            'prompt' => new PromptSubmitted($hook, new PromptDetails('prompt-1', 'Build the plan.', 'prompt-1')),
            'shell command' => new ShellCommandRequested(
                $hook,
                new ShellCommand(
                    'composer test',
                    ShellDialect::Bash,
                    ParseOutcome::Complete,
                    [new CommandPart('composer', ['test'], CommandEffect::ChangesFiles, CommandType::Verification)],
                ),
            ),
            'file edit' => new FileEditRequested(
                $hook,
                new FileChanges([new FileChange('app/Domains/Contracts/Domain.php', FileOperation::Edit)]),
            ),
            'tool requested' => new ToolRequested(
                $hook,
                ClaudeCodeTool::Read->operation(new DriverToolInput(['file_path' => 'app/Models/Task.php'])),
            ),
            'stop' => new StopRequested($hook, new StopDetails('turn-1', false, '')),
            'compaction' => new ContextCompacted($hook, new CompactionDetails('compaction-1')),
            'tool finished' => new ToolFinished(
                $hook,
                new ToolResult('Bash', ToolOutcome::Succeeded, new DriverToolInput(['command' => 'ls'])),
            ),
            'session end' => new SessionEnded($hook, new SessionEndDetails(SessionEndReason::Exit)),
        ];
    }
}
