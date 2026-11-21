<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Agents\Enums\HostProtocolVersion;
use App\Connections\Models\ProjectBinding;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\SendsHostCalls;
use Tests\TestCase;

/**
 * The host work routes speak protocol 2 to a connected project's relay, scoped to its live binding: its claim is
 * answered, the same call after the binding is revoked is refused, and an enrolled host keeps speaking protocol 1,
 * never 2.
 */
final class BindingHostRoutesTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;
    use RunsTrustedCommands;
    use SendsHostCalls;

    private const array TABLES = [
        'command_receipts', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings', 'projects',
        'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    public function test_a_live_bindings_relay_claims_with_protocol_2_until_the_binding_is_revoked(): void
    {
        $this->issueLine('the-ticket');
        $binding = (string) $this->redeemLine('the-ticket', self::NONCE)->assertCreated()->json('bindingId');

        $this->relayClaim()->assertOk();

        $this->actingAs($this->owner)
            ->deleteJson("/settings/project-connections/bindings/{$binding}")
            ->assertNoContent();

        $this->relayClaim()->assertUnauthorized();
        $this->assertSame(1, ProjectBinding::query()->count());
    }

    public function test_an_enrolled_host_speaks_protocol_1_and_is_refused_protocol_2(): void
    {
        $host = $this->enrolledHost();
        $claim = '/host/claim?limit=1&wait=0&watched_version=0';

        $this->signedHostCall($host, 'POST', $claim, '{}')->assertOk();
        $this->signedHostCall($host, 'POST', $claim, '{}', HostProtocolVersion::RemoteProject->value)
            ->assertStatus(426);
    }

    private function relayClaim(): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential(self::NONCE),
            '/host/claim?limit=1&wait=0&watched_version=0',
            [],
            HostProtocolVersion::RemoteProject,
            (string) Str::uuid(),
        );
    }
}
