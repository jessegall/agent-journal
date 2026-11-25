<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Inboxes\Inbox;
use App\Models\Inboxes\InboxMember;
use App\Support\ActorIdentity;
use App\Support\EnrolledHost;
use Illuminate\Testing\TestResponse;
use Tests\Support\Agents\OpensLedgerRuntimes;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * A host opens the main agent's runtime in one of its folders: it answers the new session and runtime, and the agent
 * takes the main inbox over from the main agent before it.
 */
final class OpenHostMainRuntimeTest extends TestCase
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
        'inboxes',
        'inbox_members',
        'links',
    ];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->installInboxes();
    }

    public function test_the_host_opens_the_runtime_and_the_agent_takes_the_main_inbox_over(): void
    {
        $host = $this->enrollHost();
        $before = $this->agent();
        $this->open($host, $before)->assertCreated();
        $after = $this->agent();

        $opened = $this->open($host, $after)->assertCreated();

        $runtime = AgentRuntime::query()->findOrFail($opened->json('runtime_id'));
        $this->assertSame(
            [$host->hostId, $opened->json('session_id')],
            [$runtime->host_id, $runtime->agent_session_id],
        );
        $main = Inbox::findMain()->id;
        $this->assertNotNull(InboxMember::findActive($main, ActorIdentity::of($after)));
        $this->assertNull(InboxMember::findActive($main, ActorIdentity::of($before)));
    }

    private function open(EnrolledHost $host, Agent $agent): TestResponse
    {
        return $this->journal->hostCall($host, 'POST', '/host/runtimes', [
            'agent_id' => $agent->id,
            'folder' => self::FOLDER,
            'driver' => 'claude-code',
            'driver_build' => '2.1.323',
            'profile' => 'claude',
            'model' => 'claude-opus-5-5',
        ]);
    }
}
