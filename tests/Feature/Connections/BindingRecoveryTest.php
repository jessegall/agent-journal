<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Agents\Enums\HostProtocolVersion;
use App\Agents\Models\Host;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * A relay that redeemed a line but lost the reply gets its binding back by a call signed with its credential; any
 * other caller gets one generic failure.
 */
final class BindingRecoveryTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings', 'project_environments',
        'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    private const string TARGET = '/api/project-connections/recover';

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    public function test_a_relay_that_lost_its_reply_gets_the_same_identifiers_back(): void
    {
        $this->issueLine('the-ticket');
        $redeemed = $this->redeemLine('the-ticket', self::NONCE)->assertCreated();

        $recovered = $this->recover($this->relayCredential(self::NONCE), self::NONCE)->assertOk();

        foreach (['hostId', 'projectId', 'bindingId'] as $identifier) {
            $this->assertSame($redeemed->json($identifier), $recovered->json($identifier));
        }
    }

    public function test_a_replayed_call_id_is_refused(): void
    {
        $this->issueLine('the-ticket');
        $this->redeemLine('the-ticket', self::NONCE)->assertCreated();
        $callId = (string) Str::uuid();

        $this->recover($this->relayCredential(self::NONCE), self::NONCE, $callId)->assertOk();
        $this->assertGeneric($this->recover($this->relayCredential(self::NONCE), self::NONCE, $callId));
    }

    public function test_a_strangers_nonce_an_unknown_nonce_and_a_revoked_host_get_the_generic_failure(): void
    {
        $this->issueLine('ticket-one');
        $this->issueLine('ticket-two');
        $this->redeemLine('ticket-one', self::NONCE)->assertCreated();
        $this->redeemLine('ticket-two', 'nonce-bbbbbbbbbbbbbbbb')->assertCreated();

        $this->assertGeneric($this->recover($this->relayCredential('nonce-bbbbbbbbbbbbbbbb'), self::NONCE));
        $this->assertGeneric($this->recover($this->relayCredential(self::NONCE), 'nonce-unknownunknown'));
        $this->assertGeneric($this->recover('a-credential-nobody-holds-'.str_repeat('x', 16), self::NONCE));

        Host::query()->where('credential_hash', Host::hashOf($this->relayCredential(self::NONCE)))->sole()
            ->revokeAt(CarbonImmutable::now());
        $this->assertGeneric($this->recover($this->relayCredential(self::NONCE), self::NONCE));
    }

    private function recover(string $credential, string $nonce, string|null $callId = null): TestResponse
    {
        return $this->signedRelayCall(
            $credential,
            self::TARGET,
            ['installationNonce' => $nonce],
            HostProtocolVersion::RemoteProject,
            $callId ?? (string) Str::uuid(),
        );
    }

    /**
     * @param  TestResponse<Response>  $response
     */
    private function assertGeneric(TestResponse $response): void
    {
        $response->assertNotFound()->assertJsonPath('message', 'This connection cannot be recovered.');
    }
}
