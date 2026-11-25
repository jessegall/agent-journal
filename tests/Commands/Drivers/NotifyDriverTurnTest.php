<?php

declare(strict_types=1);

namespace Tests\Commands\Drivers;

use App\Commands\Drivers\NotifyDriverTurn\NotifyDriverTurnCommand;
use App\Enums\Runs\RuntimeActivity;
use App\Models\Accounts\Account;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverTurn;
use App\Models\Projects\Host;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\OpensPairChats;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\Support\WritesInboxMessages;
use Tests\TestCase;

/**
 * A host reports a turn: a started turn runs and a finished one leaves the runtime idle.
 */
final class NotifyDriverTurnTest extends TestCase
{
    use CommitsHookRows;
    use OpensLedgerRuntimes;
    use OpensPairChats;
    use RunsTrustedCommands;
    use SendsHostCalls;
    use WritesInboxMessages;

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

    /**
     * A setting change the host staged waits for a turn and counts as applied only on that turn's evidence: the model
     * its output names confirms a model change, while an effort change, which no output shows, stays unconfirmed.
     */
    /**
     * A host that could not start a turn, such as a prompt its screen did not let in, reports it staged and tries no
     * more: the journal takes the request back and offers it again once its wait has passed.
     */
    /**
     * The host reports a turn's end as it saw it; the journal judges a result marked an error as a failed turn.
     */
    /**
     * A turn that runs past the journal's limit is interrupted on the next engine pass, once, and its runtime held.
     */
    /**
     * The host reports plain facts and the journal chooses the hold: an account that is not signed in, and a stop the
     * host could not prove, each leave the runtime needing attention.
     */
    /**
     * The journal's hold is the only one: an interrupted runtime is offered no new work until a user releases it, and
     * then it is.
     */
    /**
     * A host keeps the runtime of every session it ever ran, so a claim reads only those with a request waiting, and
     * more than a page of their requests when they hold that many.
     */
    public function test_a_started_turn_runs_and_a_finished_one_leaves_the_runtime_idle(): void
    {
        [$host, $opened] = $this->openRuntime();

        $this->asSystem(
            new NotifyDriverTurnCommand($host->hostId, $opened->runtimeId, 1, 'prompt-1', false, 'opus', 'high', null),
        );
        $this->assertSame(RuntimeActivity::Running, AgentRuntime::query()->findOrFail($opened->runtimeId)->activity);

        $this->asSystem(
            new NotifyDriverTurnCommand($host->hostId, $opened->runtimeId, 1, 'prompt-1', true, 'opus', 'high', 'finished'),
        );

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $this->assertSame(RuntimeActivity::Idle, $runtime->activity);
        $this->assertSame('high', $runtime->observed_effort);
        $this->assertSame(1, DriverTurn::query()->where('agent_runtime_id', $opened->runtimeId)->count());
    }

    /**
     * An idle runtime reports nothing between two turns, so its last report grew stale after a
     * minute and its session read as Status unknown though nothing was wrong.
     */
    /**
     * A page learns that a session's state changed from the host's report itself, so its header
     * never waits for a reload; a beat that only keeps a fresh report fresh says nothing.
     */
}
