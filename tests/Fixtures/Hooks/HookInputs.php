<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Support\ToolNames\Enums\ClaudeCodeTool;
use App\Support\Inputs\Contracts\HookInput;
use App\Enums\Files\FileOperation;
use App\Enums\Sessions\SessionEndReason;
use App\Enums\Hooks\ContextStartType;
use App\Enums\Hooks\ToolOutcome;
use App\Support\Inputs\Values\CompactionDetails;
use App\Support\Inputs\ContextCompacted;
use App\Support\Inputs\Values\FileChange;
use App\Support\Inputs\Values\FileChanges;
use App\Support\Inputs\FileEditRequested;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\DriverToolInput;
use App\Support\Inputs\Values\PromptDetails;
use App\Support\Inputs\PromptSubmitted;
use App\Support\Inputs\Values\SessionEndDetails;
use App\Support\Inputs\SessionEnded;
use App\Support\Inputs\Values\SessionStartDetails;
use App\Support\Inputs\SessionStarted;
use App\Support\Inputs\ShellCommandRequested;
use App\Support\Inputs\Values\StopDetails;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\ToolFinished;
use App\Support\Inputs\ToolRequested;
use App\Support\Inputs\Values\ToolResult;
use App\Enums\CommandRules\CommandEffect;
use App\Enums\CommandRules\CommandType;
use App\Enums\CommandRules\ParseOutcome;
use App\Enums\Processes\ShellDialect;
use App\Values\CommandPart;
use App\Values\ShellCommand;

/**
 * One input of every hook, for tests that must cover them all.
 */
final class HookInputs
{
    /**
     * Every hook input as a PHPUnit data set named for its hook.
     *
     * @return iterable<string, array{HookInput}>
     */
    public static function dataSets(): iterable
    {
        foreach (self::all() as $name => $input) {
            yield $name => [$input];
        }
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
