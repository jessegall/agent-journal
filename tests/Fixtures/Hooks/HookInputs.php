<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

use App\Domain\Hooks\Inputs\CompactionDetails;
use App\Domain\Hooks\Inputs\ContextCompacted;
use App\Domain\Hooks\Inputs\FileChange;
use App\Domain\Hooks\Inputs\FileChanges;
use App\Domain\Hooks\Inputs\FileEditRequested;
use App\Domain\Hooks\Inputs\FileOperation;
use App\Domain\Hooks\Inputs\HookIdentity;
use App\Domain\Hooks\Inputs\HookInput;
use App\Domain\Hooks\Inputs\PromptDetails;
use App\Domain\Hooks\Inputs\PromptSubmitted;
use App\Domain\Hooks\Inputs\SessionEndDetails;
use App\Domain\Hooks\Inputs\SessionEnded;
use App\Domain\Hooks\Inputs\SessionEndReason;
use App\Domain\Hooks\Inputs\SessionStartDetails;
use App\Domain\Hooks\Inputs\SessionStarted;
use App\Domain\Hooks\Inputs\SessionStartSource;
use App\Domain\Hooks\Inputs\ShellCommand;
use App\Domain\Hooks\Inputs\ShellCommandRequested;
use App\Domain\Hooks\Inputs\StopDetails;
use App\Domain\Hooks\Inputs\StopRequested;
use App\Domain\Hooks\Inputs\ToolFinished;
use App\Domain\Hooks\Inputs\ToolOutcome;
use App\Domain\Hooks\Inputs\ToolResult;

/**
 * One input of every hook, for tests that must cover them all.
 */
final class HookInputs
{
    /**
     * @return array<string, HookInput>
     */
    public static function all(): array
    {
        $hook = new HookIdentity(1, 2, 'hook-1', 'digest');

        return [
            'session start' => new SessionStarted($hook, new SessionStartDetails('vendor-1', SessionStartSource::Startup)),
            'prompt' => new PromptSubmitted($hook, new PromptDetails('prompt-1', 'Build the plan.')),
            'shell command' => new ShellCommandRequested($hook, new ShellCommand('composer test', ['composer test'])),
            'file edit' => new FileEditRequested($hook, new FileChanges([new FileChange('app/Domain/Domain.php', FileOperation::Edit)])),
            'stop' => new StopRequested($hook, new StopDetails('turn-1', false)),
            'compaction' => new ContextCompacted($hook, new CompactionDetails(2)),
            'tool finished' => new ToolFinished($hook, new ToolResult('Bash', ToolOutcome::Succeeded)),
            'session end' => new SessionEnded($hook, new SessionEndDetails(SessionEndReason::Exit)),
        ];
    }
}
