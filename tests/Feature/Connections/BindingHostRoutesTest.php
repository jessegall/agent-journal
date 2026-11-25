<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Exceptions\HostRoleRefused;
use App\Models\Projects\ProjectBinding;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * Each host route admits the role it names: the shared work routes answer a relay scoped to its live binding and an
 * enrolled host alike, a relay whose binding is revoked is refused, a relay's own routes refuse an enrolled host, and
 * an enrolled host's routes refuse a relay.
 */
final class BindingHostRoutesTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    public function test_a_live_bindings_relay_claims_on_a_shared_route_until_the_binding_is_revoked(): void
    {
        $this->issueLine('the-ticket');
        $binding = (string) $this->redeemLine('the-ticket', self::NONCE)->assertCreated()->json('bindingId');

        $this->relayClaim()->assertOk();

        $this->actingAs($this->owner)
            ->deleteJson("/project-connections/bindings/{$binding}")
            ->assertOk();

        $this->relayClaim()->assertUnauthorized();
        $this->assertSame(1, ProjectBinding::query()->count());
    }

    public function test_an_enrolled_host_claims_on_a_shared_route_and_is_refused_a_relays_route(): void
    {
        $host = $this->enrolledHost();

        $this->signedHostCall($host, 'POST', '/host/claim?limit=1&wait=0&watched_version=0', '{}')->assertOk();
        $this->signedHostCall($host, 'POST', '/host/bindings/'.strtolower((string) Str::ulid()).'/presence', '{}')
            ->assertForbidden()
            ->assertJsonPath('message', HostRoleRefused::forRelayOnly($host->hostId)->getMessage());
    }

    public function test_a_relay_is_refused_an_enrolled_hosts_route(): void
    {
        $this->issueLine('the-ticket');
        $binding = ProjectBinding::query()->findOrFail(
            $this->redeemLine('the-ticket', self::NONCE)->assertCreated()->json('bindingId'),
        );

        $this->signedRelayCall($this->relayCredential(self::NONCE), '/host/sign-ins/claim', [], (string) Str::uuid())
            ->assertForbidden()
            ->assertJsonPath('message', HostRoleRefused::forEnrolledOnly($binding->host_id)->getMessage());
    }

    private function relayClaim(): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential(self::NONCE),
            '/host/claim?limit=1&wait=0&watched_version=0',
            [],
            (string) Str::uuid(),
        );
    }
}
