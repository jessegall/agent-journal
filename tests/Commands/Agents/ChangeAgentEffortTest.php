<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Commands\Agents\ChangeAgentEffort\ChangeAgentEffortCommand;
use App\Enums\Drivers\DriverOperation;
use App\Enums\Drivers\RequestProgress;
use App\Exceptions\DriverRequestRefused;
use App\Models\Drivers\DriverRequest;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A later effort supersedes an earlier one that has not run, and an unknown effort is refused before anything is
 * accepted.
 */
#[TestsCommand(ChangeAgentEffortCommand::class)]
final class ChangeAgentEffortTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;

    private const array TABLES = [
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'hosts',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'links',
    ];

    public function test_a_later_effort_supersedes_an_earlier_one_that_has_not_run(): void
    {
        [, $opened] = $this->openRuntime();

        $high = $this->asOwner(
            new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-1', 'high'),
        );
        $this->asOwner(new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-2', 'low'));

        $this->assertSame(RequestProgress::Superseded, DriverRequest::query()->findOrFail($high->requestId)->progress);
    }

    public function test_an_unknown_effort_is_refused_before_anything_is_accepted(): void
    {
        [, $opened] = $this->openRuntime();

        try {
            $this->asOwner(
                new ChangeAgentEffortCommand($this->agentIdOf($opened), $opened->sessionId, 'effort-1', 'extreme'),
            );
            $this->fail('An unknown effort was accepted.');
        } catch (DriverRequestRefused) {
            $this->assertSame(0, DriverRequest::query()->where('operation', DriverOperation::ChangeEffort)->count());
        }
    }
}
