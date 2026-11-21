<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Models\AgentRuntime;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Models\ProjectBinding;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * A binding's relay reports its presence with no provider session: its own host turns it ready, an older report
 * changes nothing, another host is refused, and the binding reads offline once its presence expires.
 */
final class BindingPresenceTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings', 'projects', 'agent_runtimes', 'agents',
        'hosts', 'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    public function test_a_first_provisioned_report_turns_the_binding_ready_with_no_runtime(): void
    {
        $binding = $this->connected(self::NONCE);

        $reply = $this->report(self::NONCE, $binding, 'boot-1', 1)->assertOk();

        $fresh = ProjectBinding::query()->findOrFail($binding);
        $this->assertSame(BindingReadiness::Ready, $fresh->readinessAt(CarbonImmutable::now()));
        $this->assertSame(1, $reply->json('generation'));
        $this->assertSame(0, AgentRuntime::query()->count());
    }

    public function test_a_replayed_older_sequence_changes_nothing(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->report(self::NONCE, $binding, 'boot-1', 5)->assertOk();
        $before = ProjectBinding::query()->findOrFail($binding);

        $this->travel(10)->seconds();
        $this->report(self::NONCE, $binding, 'boot-1', 3)->assertOk();

        $after = ProjectBinding::query()->findOrFail($binding);
        $this->assertSame(5, $after->report_sequence);
        $this->assertEquals($before->presence_expires_at, $after->presence_expires_at);
    }

    public function test_a_new_boot_takes_over_a_live_one_only_when_it_asks(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->report(self::NONCE, $binding, 'boot-1', 1)->assertOk();

        $this->report(self::NONCE, $binding, 'boot-2', 1)->assertConflict();
        $taken = $this->report(self::NONCE, $binding, 'boot-2', 1, takeover: true)->assertOk();

        $this->assertSame(2, $taken->json('generation'));
    }

    public function test_a_report_from_another_host_is_refused(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->connected('nonce-bbbbbbbbbbbbbbbb');

        $this->report('nonce-bbbbbbbbbbbbbbbb', $binding, 'boot-1', 1)->assertForbidden();

        $this->assertSame(BindingReadiness::Pending, ProjectBinding::query()->findOrFail($binding)->readiness);
    }

    public function test_the_binding_reads_offline_once_its_presence_expires_with_no_report(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->report(self::NONCE, $binding, 'boot-1', 1)->assertOk();

        $this->travel(ProjectBinding::PRESENCE_SECONDS + 1)->seconds();

        $offline = ProjectBinding::query()->findOrFail($binding)->readinessAt(CarbonImmutable::now());
        $this->assertSame(BindingReadiness::Offline, $offline);
    }

    private function connected(string $nonce): string
    {
        $ticket = 'ticket-'.$nonce;
        $this->issueLine($ticket);

        return (string) $this->redeemLine($ticket, $nonce)->assertCreated()->json('bindingId');
    }

    private function report(
        string $nonce,
        string $binding,
        string $bootId,
        int $sequence,
        bool $takeover = false,
    ): TestResponse {
        return $this->signedRelayCall(
            $this->relayCredential($nonce),
            "/host/bindings/{$binding}/presence",
            [
                'bootId' => $bootId,
                'sequence' => $sequence,
                'release' => '1.0.0',
                'protocol' => HostProtocolVersion::RemoteProject->value,
                'combinations' => [],
                'provisioning' => 'succeeded',
                'takeover' => $takeover,
            ],
            HostProtocolVersion::RemoteProject,
            (string) Str::uuid(),
        );
    }
}
