<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Models\Projects\ProjectBinding;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * A binding's host reads the binding's readiness and last contact without reporting; another host cannot read its
 * status.
 */
final class BindingStatusTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings', 'project_environments',
        'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

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
