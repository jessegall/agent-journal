<?php

declare(strict_types=1);

namespace Tests\Commands\Agents;

use App\Enums\Drivers\DriverType;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\ProjectBinding;
use App\Support\AgentRuntimes;
use App\Support\StartSessions;
use App\Values\RuntimeIntent;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * A live main runtime renews its lease by server time; an ended session and another agent's runtime in the binding
 * root are refused their lease.
 */
final class RenewRuntimeLeaseTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings', 'project_environments',
        'projects', 'agent_runtimes', 'agent_sessions', 'agents', 'hosts', 'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    public function test_a_live_main_runtime_renews_its_lease_by_server_time(): void
    {
        $binding = $this->connected();
        $runtime = $this->runtimeOf(Agent::query()->findOrFail($binding->main_agent_id), $binding);

        $lease = $this->renew($binding, $runtime)->assertOk();

        $this->assertSame($runtime->id, $lease->json('runtimeId'));
        $this->assertSame(1, $lease->json('generation'));
        $this->assertTrue(CarbonImmutable::parse($lease->json('expiresAt'))->isAfter($lease->json('serverTime')));
    }

    public function test_an_ended_session_is_refused_its_lease(): void
    {
        $binding = $this->connected();
        $runtime = $this->runtimeOf(Agent::query()->findOrFail($binding->main_agent_id), $binding);
        $runtime->session->endAt(CarbonImmutable::now());

        $this->renew($binding, $runtime)->assertForbidden();
    }

    public function test_another_agents_runtime_in_the_binding_root_is_refused_its_lease(): void
    {
        $binding = $this->connected();
        $runtime = $this->runtimeOf(Agent::create('Stranger '.Str::random(6), 'main-agent', $this->localProject()), $binding);

        $this->renew($binding, $runtime)->assertForbidden();
    }

    private function connected(): ProjectBinding
    {
        $this->issueLine('the-ticket');
        $redeemed = $this->redeemLine('the-ticket', self::NONCE)->assertCreated();

        return ProjectBinding::query()->whereKey($redeemed->json('bindingId'))->sole();
    }

    private function runtimeOf(Agent $agent, ProjectBinding $binding): AgentRuntime
    {
        $started = $this->app->make(StartSessions::class)->start(
            $agent,
            TestSelections::of('claude-code'),
            TestSelections::requestId(),
        );
        $intent = new RuntimeIntent(
            $binding->host_id,
            $binding->canonical_root,
            'claude-code',
            '1.0.0',
            'default',
            DriverType::Terminal,
            null,
            null,
            null,
        );
        [$runtime] = $this->app->make(AgentRuntimes::class)->open($started->session, $intent, 'start-token');
        $runtime->load('session');

        return $runtime;
    }

    private function renew(ProjectBinding $binding, AgentRuntime $runtime): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential(self::NONCE),
            "/host/bindings/{$binding->id}/runtimes/{$runtime->id}/lease",
            ['authorityGeneration' => $binding->authority_generation, 'runtimeGeneration' => 1],
            (string) Str::uuid(),
        );
    }
}
