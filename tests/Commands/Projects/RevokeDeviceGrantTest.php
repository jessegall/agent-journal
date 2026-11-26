<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\RevokeDeviceGrant\RevokeDeviceGrantCommand;
use App\Enums\Connections\BindingReadiness;
use App\Models\Projects\DeviceGrant;
use App\Models\Projects\ProjectBinding;
use App\Values\InstallTicket;
use Carbon\CarbonImmutable;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * A revoked grant is refused while the binding stays connected, and revoking one terminal's sign-in leaves the other
 * working.
 */
#[TestsCommand(RevokeDeviceGrantCommand::class)]
final class RevokeDeviceGrantTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'assignments', 'tasks', 'command_receipts', 'device_grants', 'connection_audits', 'project_invitations',
        'install_attempts', 'project_bindings', 'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts',
        'settings_records', 'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_a_revoked_grant_is_refused_while_the_binding_stays_connected(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->actingAs($this->owner)->post("/project-connections/devices/{$start->json('userCode')}/approve");
        $grant = (string) $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->json('grant');

        $this->actingAs($this->owner)
            ->deleteJson('/project-connections/devices/'.DeviceGrant::query()->sole()->id)
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

    public function test_revoking_one_terminal_sign_in_leaves_the_other_working(): void
    {
        $binding = $this->connected();
        $first = $this->approvedGrant($binding);
        $second = $this->approvedGrant($binding);
        $revoked = DeviceGrant::query()->where('grant_digest', InstallTicket::digestOf($first))->sole();

        $this->actingAs($this->owner)
            ->deleteJson("/project-connections/devices/{$revoked->id}")
            ->assertNoContent();

        $this->actingAs($this->owner)->get('/connections')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->has('page.data.bindings.rows.0.signIns', 2)
            ->where('page.data.bindings.rows.0.signIns.1.reference', $revoked->reference)
            ->where('page.data.bindings.rows.0.signIns.1.state', 'revoked'));
        $this->deviceCommand($first, $binding)->assertUnauthorized();
        $this->deviceCommand($second, $binding)->assertForbidden();
    }

    private function approvedGrant(string $binding): string
    {
        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->actingAs($this->owner)->post("/project-connections/devices/{$start->json('userCode')}/approve");

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
            (string) Str::uuid(),
        );
    }
}
