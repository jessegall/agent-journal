<?php

declare(strict_types=1);

namespace Tests\Feature\Seeding;

use App\Models\Agents\AgentRuntime;
use Tests\Support\CommitsHookRows;
use Tests\Support\WithActiveAccount;
use Tests\TestCase;

/**
 * The journal opens an agent's runtime on a host it enrolled, through the real start path, and gives the one-session
 * agent shortcut its open runtime.
 */
final class JournalRuntimesTest extends TestCase
{
    use CommitsHookRows;
    use WithActiveAccount;

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
        'inboxes',
        'inbox_members',
        'links',
        'users',
    ];

    public function test_a_runtime_opened_on_an_enrolled_host_belongs_to_the_named_agent(): void
    {
        $this->chooseActiveAccounts();
        $this->journal->owner()->idleAgent('Driven')->enrollHost('Laptop', ['/work/project']);

        $opened = $this->journal->openRuntimeOn('Driven', 'Laptop', '/work/project');

        $runtime = AgentRuntime::query()->findOrFail($opened->runtimeId);
        $host = $this->journal->hostCalled('Laptop')->hostId;
        $this->assertSame([$host, $opened->sessionId], [$runtime->host_id, $runtime->agent_session_id]);
    }

    public function test_the_one_session_agent_has_its_runtime(): void
    {
        $this->journal->owner()->agent('Ada');

        $session = $this->journal->sessionOf('Ada')->id;
        $this->assertSame(1, AgentRuntime::query()->where('agent_session_id', $session)->count());
    }
}
