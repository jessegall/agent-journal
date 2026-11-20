<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\DatabaseClock;
use App\Agents\Actions\StartHeartbeats;
use App\Agents\Actions\StartSessions;
use App\Agents\Actions\StartTokens;
use App\Agents\Commands\RecordHeartbeat;
use App\Agents\Enums\SessionStatus;
use App\Agents\Exceptions\CredentialRejected;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\StartedAgent;
use App\Bus\Contracts\CommandBus;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestStartAuthority;
use Tests\TestCase;

/**
 * A heartbeat of a running session records the database server's time and makes a silent session active again; an
 * ended, revoked or retired one is refused and nothing is written.
 */
final class RecordHeartbeatTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'hook_calls'];

    public function test_a_beat_records_the_database_server_time(): void
    {
        $started = $this->start();
        $before = $this->app->make(DatabaseClock::class)->now()->startOfSecond();

        $this->beat($started->session);

        $beat = $started->session->refresh()->last_heartbeat_at;
        $this->assertInstanceOf(CarbonImmutable::class, $beat);
        $this->assertTrue($beat->greaterThanOrEqualTo($before));
        $this->assertTrue($beat->lessThanOrEqualTo($this->app->make(DatabaseClock::class)->now()->addSecond()));
        $this->assertSame(SessionStatus::Active, $started->session->refresh()->status);
    }

    public function test_a_beat_makes_a_silent_session_active_again(): void
    {
        $started = $this->start();
        $this->startedSecondsAgo($started->session, 121);
        $this->app->make(StartHeartbeats::class)->markSilentStarts();
        $this->assertSame(SessionStatus::Silent, $started->session->refresh()->status);

        $this->beat($started->session);

        $this->assertSame(SessionStatus::Active, $started->session->refresh()->status);
        $this->assertNull($started->session->refresh()->silent_since);
    }

    public function test_a_beat_of_an_ended_session_is_refused_and_writes_nothing(): void
    {
        $started = $this->start();
        $this->app->make(StartHeartbeats::class)->markExited($started->session, 'exit code 0');

        $this->assertRefused($started->session, CredentialRejected::revoked()->getMessage());
    }

    public function test_a_beat_with_a_revoked_credential_is_refused_and_writes_nothing(): void
    {
        $started = $this->start();
        $this->app->make(StartTokens::class)->revoke($started->session);

        $this->assertRefused($started->session, CredentialRejected::revoked()->getMessage());
    }

    public function test_a_beat_of_a_retired_agent_is_refused_and_writes_nothing(): void
    {
        $started = $this->start();
        $started->session->loadMissing('agent')->agent->retireAt(CarbonImmutable::now());

        $this->assertRefused($started->session, CredentialRejected::agentRetired()->getMessage());
    }

    public function test_a_beat_of_a_session_with_an_ended_status_but_a_live_credential_is_refused(): void
    {
        $started = $this->start();
        $started->session->endAt(CarbonImmutable::now());

        $this->assertRefused($started->session, CredentialRejected::sessionEnded()->getMessage());
    }

    public function test_the_session_table_indexes_status_and_last_heartbeat(): void
    {
        $indexes = array_map(fn (array $index) => $index['columns'], Schema::getIndexes('agent_sessions'));

        $this->assertContains(['status', 'last_heartbeat_at'], $indexes);
    }

    private function assertRefused(AgentSession $session, string $message): void
    {
        try {
            $this->beat($session);
            $this->fail('The heartbeat was not refused.');
        } catch (CredentialRejected $rejected) {
            $this->assertSame($message, $rejected->getMessage());
        }

        $this->assertNull($session->refresh()->last_heartbeat_at);
    }

    private function start(): StartedAgent
    {
        $started = $this->app->make(StartSessions::class)->start(
            Agent::create('Test agent', 'main-agent'),
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forAgent($started->session->agent_id),
            TestStartAuthority::forAgent($started->session->agent_id),
        );

        return $started;
    }

    private function beat(AgentSession $session): void
    {
        $this->app->make(CommandBus::class)->run(new RecordHeartbeat($session->id));
    }

    private function startedSecondsAgo(AgentSession $session, int $seconds): void
    {
        DB::table('agent_sessions')->where('id', $session->id)->update(
            ['created_at' => $this->app->make(DatabaseClock::class)->now()->subSeconds($seconds)],
        );
    }
}
