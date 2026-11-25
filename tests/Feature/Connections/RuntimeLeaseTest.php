<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Enums\Drivers\DriverType;
use App\Models\Agents\Agent;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\ProjectBinding;
use App\Support\AgentRuntimes;
use App\Support\StartSessions;
use App\Values\RuntimeIntent;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Fixtures\Agents\TestSelections;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * The presence receipt a binding's relay gets names the authority generation every lease renewal carries.
 */
final class RuntimeLeaseTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings', 'project_environments',
        'projects', 'agent_runtimes', 'agent_sessions', 'agents', 'hosts', 'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    public function test_the_presence_receipt_names_the_authority_generation(): void
    {
        $binding = $this->connected();

        $receipt = $this->signedRelayCall(
            $this->relayCredential(self::NONCE),
            "/host/bindings/{$binding->id}/presence",
            [
                'bootId' => 'boot-1', 'sequence' => 1, 'release' => '1.0.0',
                'descriptors' => [],
                'provisioning' => 'succeeded', 'isTakeover' => false,
            ],
            (string) Str::uuid(),
        )->assertOk();

        $this->assertSame($binding->authority_generation, $receipt->json('authorityGeneration'));
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
