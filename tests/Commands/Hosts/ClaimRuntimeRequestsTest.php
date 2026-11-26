<?php

declare(strict_types=1);

namespace Tests\Commands\Hosts;

use App\Agents\Drivers\Enums\DriverType;
use App\Exceptions\WorkerFenced;
use App\Hosts\Commands\ClaimHostWorker\ClaimHostWorkerCommand;
use App\Hosts\Commands\ClaimRuntimeRequests\ClaimRuntimeRequestsCommand;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The worker that holds a process claims the waiting requests of the process's runtime, each once; a deposed worker
 * is fenced and claims nothing.
 */
#[TestsCommand(ClaimRuntimeRequestsCommand::class)]
final class ClaimRuntimeRequestsTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

    private const array TABLES = [
        'hosts',
        'host_processes',
        'host_orders',
        'agents',
        'agent_sessions',
        'session_tokens',
        'agent_stacks',
        'hook_calls',
        'agent_runtimes',
        'driver_requests',
        'driver_turns',
        'accounts',
        'active_accounts',
        'session_processes',
        'inboxes',
        'inbox_members',
        'links',
        'users',
    ];

    public function test_the_current_worker_claims_the_runtimes_request_once_and_a_deposed_one_is_fenced(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->showDriverArrangements()->idleAgent('Driven')->enrollHost('Mac', [base_path()]);
        $opened = $this->journal->openRuntimeOn('Driven', 'Mac', base_path(), driverType: DriverType::Terminal, firstMessage: 'hello');
        $this->journal->openHostProcess('Mac', 'shell', runtimeId: $opened->runtimeId);
        $id = $this->journal->hostProcessCalled('shell')->id;
        $generation = $this->journal->asSystem(new ClaimHostWorkerCommand($id));

        $first = $this->journal->asSystem(new ClaimRuntimeRequestsCommand($id, $generation, 10));
        $again = $this->journal->asSystem(new ClaimRuntimeRequestsCommand($id, $generation, 10));

        $this->journal
            ->assertRefused(
                WorkerFenced::class,
                fn () => $this->journal->asSystem(new ClaimRuntimeRequestsCommand($id, $generation - 1, 10)),
            )
            ->assertResult([1, 0], [count($first->requests), count($again->requests)]);
    }
}
