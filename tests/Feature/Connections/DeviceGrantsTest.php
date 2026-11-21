<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Agents\Enums\HostProtocolVersion;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Models\DeviceGrant;
use App\Connections\Models\ProjectBinding;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\TestCase;

/**
 * A shell user outside a provider session gets a short-lived grant by device approval: the shell is shown a URL and
 * a code, the owner approves it in the browser, an expired code is refused, and a revoked grant is refused while the
 * binding stays connected.
 */
final class DeviceGrantsTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'command_receipts', 'device_grants', 'connection_audits', 'project_invitations', 'install_attempts', 'project_bindings',
        'projects', 'agent_runtimes', 'agents', 'hosts', 'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    public function test_the_shell_gets_a_url_and_code_and_its_grant_once_the_owner_approves(): void
    {
        $binding = $this->connected();

        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->assertStringStartsWith('https://journal.example.com/connections/devices/', (string) $start->json('approvalUrl'));
        $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(428);

        $this->travel(DeviceGrant::POLL_SECONDS_MINIMUM + 1)->seconds();
        $this->actingAs($this->owner)
            ->post("/settings/project-connections/devices/{$start->json('userCode')}/approve")
            ->assertRedirect();
        $grant = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertOk();

        $this->assertNotEmpty($grant->json('grant'));
        $this->assertStringNotContainsString((string) $grant->json('grant'), (string) json_encode(DeviceGrant::query()->sole()->getAttributes()));
    }

    public function test_an_expired_code_is_refused(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();

        $this->travel(DeviceGrant::CODE_MINUTES + 1)->minutes();

        $this->actingAs($this->owner)
            ->postJson("/settings/project-connections/devices/{$start->json('userCode')}/approve")
            ->assertNotFound();
        $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertNotFound();
    }

    public function test_a_revoked_grant_is_refused_while_the_binding_stays_connected(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->actingAs($this->owner)->post("/settings/project-connections/devices/{$start->json('userCode')}/approve");
        $grant = (string) $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->json('grant');

        $this->actingAs($this->owner)
            ->deleteJson('/settings/project-connections/devices/'.DeviceGrant::query()->sole()->id)
            ->assertNoContent();

        $this->postJson('https://localhost/api/project-commands/device', [
            'request_key' => 'request-1',
            'binding' => $binding,
            'argv' => ['overview', 'now'],
            'stdin' => '',
        ], ['Authorization' => "Bearer {$grant}"])->assertUnauthorized();
        $this->assertNotSame(
            BindingReadiness::Revoked,
            ProjectBinding::query()->findOrFail($binding)->readinessAt(CarbonImmutable::now()),
        );
    }

    public function test_an_approved_grant_authenticates_its_approver_for_its_own_binding_only(): void
    {
        $binding = $this->connected();
        $grant = $this->approvedGrant($binding);

        $command = $this->deviceCommand($grant, $binding)->assertForbidden();
        $this->assertStringContainsString('runs in a provider session', (string) $command->json('message'));

        $other = (string) Str::ulid();
        $refusal = $this->deviceCommand($grant, $other)->assertForbidden();
        $this->assertStringContainsString($other, (string) $refusal->json('message'));
    }

    public function test_a_grant_whose_approver_the_journal_no_longer_admits_is_refused(): void
    {
        $binding = $this->connected();
        $grant = $this->approvedGrant($binding);

        $this->app->instance(AccessSettings::class, new AccessSettings(User::factory()->create()->id));

        $refusal = $this->deviceCommand($grant, $binding)->assertForbidden();
        $this->assertStringContainsString('can no longer use the journal', (string) $refusal->json('message'));
    }

    private function approvedGrant(string $binding): string
    {
        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->actingAs($this->owner)->post("/settings/project-connections/devices/{$start->json('userCode')}/approve");

        return (string) $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->json('grant');
    }

    private function deviceCommand(string $grant, string $binding): TestResponse
    {
        $this->app['auth']->forgetGuards();

        return $this->postJson('https://localhost/api/project-commands/device', [
            'request_key' => 'request-1',
            'binding' => $binding,
            'argv' => ['overview', 'now'],
            'stdin' => '',
        ], ['Authorization' => "Bearer {$grant}"]);
    }

    private function connected(): string
    {
        $this->issueLine('the-ticket');

        return (string) $this->redeemLine('the-ticket', self::NONCE)->assertCreated()->json('bindingId');
    }

    /**
     * @param  array<string, mixed>  $body
     */
    private function relay(string $target, array $body): TestResponse
    {
        return $this->signedRelayCall(
            $this->relayCredential(self::NONCE),
            $target,
            $body,
            HostProtocolVersion::RemoteProject,
            (string) Str::uuid(),
        );
    }
}
