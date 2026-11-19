<?php

declare(strict_types=1);

namespace Tests\Feature\Agents;

use App\Actors\Support\ActiveActorCounterRegistry;
use App\Actors\Support\ActiveActorsResolver;
use App\Agents\Actions\StartSessions;
use App\Agents\Actions\StartTokens;
use App\Agents\Models\Agent;
use App\Agents\Models\AgentSession;
use App\Agents\Support\AgentSessionCounter;
use Carbon\CarbonImmutable;
use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * An agent session is present while its beat plus the window is strictly later than the observation time, its session
 * runs, its credential stands and its agent is not retired; every present session counts, in one count query.
 */
final class AgentSessionCounterTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agents', 'agent_sessions', 'start_tokens', 'agent_stacks', 'hook_calls'];

    private CarbonImmutable $beat;

    private Agent $agent;

    protected function setUp(): void
    {
        parent::setUp();

        $this->beat = CarbonImmutable::parse('2026-11-18 12:00:00');
        $this->agent = Agent::named('Test agent', 'main-agent');
    }

    public function test_a_beat_counts_until_its_window_ends_and_not_at_the_boundary(): void
    {
        $this->beatingSession();

        $this->assertSame(1, $this->countAt('2026-11-18 12:01:59'));
        $this->assertSame(0, $this->countAt('2026-11-18 12:02:00'));
    }

    public function test_two_present_sessions_of_one_agent_count_two(): void
    {
        $this->beatingSession();
        $this->beatingSession();

        $this->assertSame(2, $this->countAt('2026-11-18 12:01:00'));
    }

    public function test_a_session_that_never_beat_is_absent(): void
    {
        $this->app->make(StartSessions::class)->start(
            $this->agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );

        $this->assertSame(0, $this->countAt('2026-11-18 12:01:00'));
    }

    public function test_an_ended_session_counts_zero(): void
    {
        $this->beatingSession()->endAt(CarbonImmutable::now());

        $this->assertSame(0, $this->countAt('2026-11-18 12:01:00'));
    }

    public function test_a_revoked_credential_counts_zero(): void
    {
        $this->app->make(StartTokens::class)->revoke($this->beatingSession());

        $this->assertSame(0, $this->countAt('2026-11-18 12:01:00'));
    }

    public function test_a_retired_agent_counts_zero(): void
    {
        $this->beatingSession();
        $this->agent->retireAt(CarbonImmutable::now());

        $this->assertSame(0, $this->countAt('2026-11-18 12:01:00'));
    }

    public function test_the_count_is_one_query_and_hydrates_no_session(): void
    {
        $this->beatingSession();
        $queries = [];
        DB::listen(function (QueryExecuted $query) use (&$queries): void {
            $queries[] = $query->sql;
        });

        $this->countAt('2026-11-18 12:01:00');

        $this->assertCount(1, $queries);
        $this->assertStringStartsWith('select count(*) as "aggregate" from "agent_sessions"', $queries[0]);
    }

    public function test_the_agents_counter_is_registered_for_active_actors(): void
    {
        $this->assertGreaterThanOrEqual(0, $this->app->make(ActiveActorsResolver::class)->snapshot()->agentSessions);
        $this->assertSame(
            AgentSessionCounter::class,
            $this->app->make(ActiveActorCounterRegistry::class)->get(AgentSessionCounter::type())::class,
        );
    }

    private function beatingSession(): AgentSession
    {
        $session = $this->app->make(StartSessions::class)->start(
            $this->agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        )->session;
        $session->recordHeartbeatAt($this->beat);

        return $session;
    }

    private function countAt(string $observedAt): int
    {
        return $this->app->make(AgentSessionCounter::class)->count(CarbonImmutable::parse($observedAt));
    }
}
