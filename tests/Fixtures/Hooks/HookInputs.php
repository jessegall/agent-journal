<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Hooks\Contracts\HookInput;
use App\Hooks\Enums\FileOperation;
use App\Hooks\Enums\SessionEndReason;
use App\Hooks\Enums\SessionStartSource;
use App\Hooks\Enums\ToolOutcome;
use App\Hooks\Inputs\CompactionDetails;
use App\Hooks\Inputs\ContextCompacted;
use App\Hooks\Inputs\FileChange;
use App\Hooks\Inputs\FileChanges;
use App\Hooks\Inputs\FileEditRequested;
use App\Hooks\Inputs\HookIdentity;
use App\Hooks\Inputs\ProgramToolInput;
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
use App\Processes\Enums\CommandEffect;
use App\Processes\Enums\CommandType;
use App\Processes\Enums\ParseOutcome;
use App\Processes\Enums\ShellDialect;
use App\Processes\Values\CommandPart;
use App\Processes\Values\ShellCommand;

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
 new SessionStartDetails('vendor-1', SessionStartSource::Startup),
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
            'stop' => new StopRequested($hook, new StopDetails('turn-1', false)),
            'compaction' => new ContextCompacted($hook, new CompactionDetails('compaction-1')),
            'tool finished' => new ToolFinished(
$hook,
 new ToolResult('Bash', ToolOutcome::Succeeded, new ProgramToolInput(['command' => 'ls'])),
),
            'session end' => new SessionEnded($hook, new SessionEndDetails(SessionEndReason::Exit)),
        ];
    }
}
