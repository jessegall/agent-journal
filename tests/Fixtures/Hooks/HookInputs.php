<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Core\Hooks\Enums\CommandEffect;
use App\Core\Hooks\Enums\CommandKind;
use App\Core\Hooks\Inputs\CommandPart;
use App\Core\Hooks\Inputs\CompactionDetails;
use App\Core\Hooks\Inputs\ContextCompacted;
use App\Core\Hooks\Inputs\FileChange;
use App\Core\Hooks\Inputs\FileChanges;
use App\Core\Hooks\Inputs\FileEditRequested;
use App\Core\Hooks\Enums\FileOperation;
use App\Core\Hooks\Inputs\HookIdentity;
use App\Core\Hooks\Contracts\HookInput;
use App\Core\Hooks\Enums\ParseOutcome;
use App\Core\Hooks\Inputs\PromptDetails;
use App\Core\Hooks\Inputs\PromptSubmitted;
use App\Core\Hooks\Inputs\SessionEndDetails;
use App\Core\Hooks\Inputs\SessionEnded;
use App\Core\Hooks\Enums\SessionEndReason;
use App\Core\Hooks\Inputs\SessionStartDetails;
use App\Core\Hooks\Inputs\SessionStarted;
use App\Core\Hooks\Enums\SessionStartSource;
use App\Core\Hooks\Inputs\ShellCommand;
use App\Core\Hooks\Inputs\ShellCommandRequested;
use App\Core\Hooks\Enums\ShellDialect;
use App\Core\Hooks\Inputs\StopDetails;
use App\Core\Hooks\Inputs\StopRequested;
use App\Core\Hooks\Inputs\ToolFinished;
use App\Core\Hooks\Enums\ToolOutcome;
use App\Core\Hooks\Inputs\ToolResult;

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
        $hook = new HookIdentity(1, 2, 'hook-1', 'digest');

        return [
            'session start' => new SessionStarted($hook, new SessionStartDetails('vendor-1', SessionStartSource::Startup)),
            'prompt' => new PromptSubmitted($hook, new PromptDetails('prompt-1', 'Build the plan.')),
            'shell command' => new ShellCommandRequested($hook, new ShellCommand('composer test', ShellDialect::Bash, ParseOutcome::Complete, [new CommandPart('composer', ['test'], CommandEffect::ChangesFiles, CommandKind::TestRun)])),
            'file edit' => new FileEditRequested($hook, new FileChanges([new FileChange('app/Domain/Domain.php', FileOperation::Edit)])),
            'stop' => new StopRequested($hook, new StopDetails('turn-1', false)),
            'compaction' => new ContextCompacted($hook, new CompactionDetails('compaction-1')),
            'tool finished' => new ToolFinished($hook, new ToolResult('Bash', ToolOutcome::Succeeded)),
            'session end' => new SessionEnded($hook, new SessionEndDetails(SessionEndReason::Exit)),
        ];
    }
}
