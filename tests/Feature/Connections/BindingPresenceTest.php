<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Enums\Connections\BindingReadiness;
use App\Models\Agents\AgentRuntime;
use App\Models\Projects\ProjectBinding;
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
        'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings', 'project_environments',
        'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    public function test_a_first_provisioned_report_turns_the_binding_ready_with_no_runtime(): void
    {
        $binding = $this->connected(self::NONCE);

        $reply = $this->notify(self::NONCE, $binding, 'boot-1', 1)->assertOk();

        $fresh = ProjectBinding::query()->findOrFail($binding);
        $this->assertSame(BindingReadiness::Ready, $fresh->readinessAt(CarbonImmutable::now()));
        $this->assertSame(1, $reply->json('generation'));
        $this->assertSame(0, AgentRuntime::query()->count());
    }

    public function test_a_report_of_an_older_setup_after_a_new_one_changes_nothing(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->notify(self::NONCE, $binding, 'boot-1', 1, setupGeneration: 2)->assertOk();
        $before = ProjectBinding::query()->findOrFail($binding);

        $this->travel(10)->seconds();
        $stale = $this->notify(self::NONCE, $binding, 'boot-1', 2, setupGeneration: 1)->assertOk();

        $after = ProjectBinding::query()->findOrFail($binding);
        $this->assertSame(2, $stale->json('setupGeneration'));
        $this->assertSame($binding, $stale->json('bindingId'));
        $this->assertSame(1, $after->report_sequence);
        $this->assertEquals($before->presence_expires_at, $after->presence_expires_at);
    }

    public function test_a_replayed_older_sequence_changes_nothing(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->notify(self::NONCE, $binding, 'boot-1', 5)->assertOk();
        $before = ProjectBinding::query()->findOrFail($binding);

        $this->travel(10)->seconds();
        $this->notify(self::NONCE, $binding, 'boot-1', 3)->assertOk();

        $after = ProjectBinding::query()->findOrFail($binding);
        $this->assertSame(5, $after->report_sequence);
        $this->assertEquals($before->presence_expires_at, $after->presence_expires_at);
    }

    public function test_a_new_boot_takes_over_a_live_one_only_when_it_asks(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->notify(self::NONCE, $binding, 'boot-1', 1)->assertOk();

        $this->notify(self::NONCE, $binding, 'boot-2', 1)->assertConflict();
        $taken = $this->notify(self::NONCE, $binding, 'boot-2', 1, isTakeover: true)->assertOk();

        $this->assertSame(2, $taken->json('generation'));
    }

    public function test_a_report_from_another_host_is_refused(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->connected('nonce-bbbbbbbbbbbbbbbb');

        $this->notify('nonce-bbbbbbbbbbbbbbbb', $binding, 'boot-1', 1)->assertForbidden();

        $this->assertSame(BindingReadiness::Pending, ProjectBinding::query()->findOrFail($binding)->readiness);
    }

    public function test_the_binding_reads_offline_once_its_presence_expires_with_no_report(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->notify(self::NONCE, $binding, 'boot-1', 1)->assertOk();

        $this->travel(ProjectBinding::PRESENCE_SECONDS + 1)->seconds();

        $offline = ProjectBinding::query()->findOrFail($binding)->readinessAt(CarbonImmutable::now());
        $this->assertSame(BindingReadiness::Offline, $offline);
    }

    public function test_its_host_reads_the_bindings_readiness_and_last_contact_without_reporting(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->notify(self::NONCE, $binding, 'boot-1', 1)->assertOk();
        $before = ProjectBinding::query()->findOrFail($binding);

        $status = $this->readStatus(self::NONCE, $binding)->assertOk();

        $after = ProjectBinding::query()->findOrFail($binding);
        $this->assertSame('ready', $status->json('readiness'));
        $this->assertSame($before->last_contact_at?->toIso8601String(), $status->json('lastContactAt'));
        $this->assertSame($before->report_sequence, $after->report_sequence);
        $this->assertEquals($before->presence_expires_at, $after->presence_expires_at);
    }

    public function test_another_host_cannot_read_the_bindings_status(): void
    {
        $binding = $this->connected(self::NONCE);
        $this->connected('nonce-bbbbbbbbbbbbbbbb');

        $this->readStatus('nonce-bbbbbbbbbbbbbbbb', $binding)->assertForbidden();
    }

    private function readStatus(string $nonce, string $binding): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential($nonce),
            "/host/bindings/{$binding}/status",
            [],
            (string) Str::uuid(),
        );
    }

    private function connected(string $nonce): string
    {
        $ticket = 'ticket-'.$nonce;
        $this->issueLine($ticket);

        return (string) $this->redeemLine($ticket, $nonce)->assertCreated()->json('bindingId');
    }

    private function notify(
        string $nonce,
        string $binding,
        string $bootId,
        int $sequence,
        bool $isTakeover = false,
        int $setupGeneration = 1,
    ): TestResponse {
        return $this->signedRelayCall(
            $this->relayCredential($nonce),
            "/host/bindings/{$binding}/presence",
            [
                'bootId' => $bootId,
                'sequence' => $sequence,
                'release' => '1.0.0',
                'descriptors' => [],
                'provisioning' => 'succeeded',
                'isTakeover' => $isTakeover,
                'setupGeneration' => $setupGeneration,
            ],
            (string) Str::uuid(),
        );
    }
}
