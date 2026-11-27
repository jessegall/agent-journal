<?php

declare(strict_types=1);

namespace Tests\Commands\Sessions;

use App\Models\Agents\AgentSession;
use App\Sessions\Commands\EndStoppedSession\EndStoppedSessionCommand;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A session whose ready state saw it stopped with nothing of it running ends; ending it again changes nothing.
 */
#[TestsCommand(EndStoppedSessionCommand::class)]
final class EndStoppedSessionTest extends TestCase
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

    public function test_a_stopped_session_ends_once(): void
    {
        [, $opened] = $this->openRuntime();
        $end = new EndStoppedSessionCommand($this->agentIdOf($opened), $opened->sessionId);

        $this->asOwner($end);
        $ended = AgentSession::query()->findOrFail($opened->sessionId);
        $this->asOwner($end);

        $this->assertFalse($ended->isActive());
        $this->assertEquals($ended->ended_at, AgentSession::query()->findOrFail($opened->sessionId)->ended_at);
    }
}
