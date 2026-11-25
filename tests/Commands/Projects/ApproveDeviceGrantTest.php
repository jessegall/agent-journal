<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Enums\Connections\ConnectionAuditType;
use App\Models\Access\User;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\DeviceGrant;
use App\Models\Projects\ProjectBinding;
use App\Support\Access\AccessSettings;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * The shell gets a url and a code and its grant once the owner approves; the approval window reads the committed
 * state of the request.
 */
final class ApproveDeviceGrantTest extends TestCase
{
    use CommitsHookRows;
    use ConnectsProjects;

    private const array TABLES = [
        'assignments',
        'tasks',
        'command_receipts',
        'device_grants',
        'connection_audits',
        'project_invitations',
        'install_attempts',
        'project_bindings',
        'project_environments',
        'projects',
        'agent_runtimes',
        'agents',
        'hosts',
        'settings_records',
        'users',
    ];

    private const string NONCE = 'nonce-aaaaaaaaaaaaaaaa';

    /**
     * The domains this test uses beside core.
     */
    private const string SESSION_USE_REFUSAL = 'runs in a provider session';

    private const string REVOKED_REFUSAL = 'can no longer use the journal';

    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_the_shell_gets_a_url_and_code_and_its_grant_once_the_owner_approves(): void
    {
        $binding = $this->connected();

        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->assertStringStartsWith(
            'https://journal.example.com/connections/devices/',
            (string) $start->json('approvalUrl'),
        );
        $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(428);

        $this->travel(DeviceGrant::POLL_SECONDS_MINIMUM + 1)->seconds();
        $this->actingAs($this->owner)
            ->post("/project-connections/devices/{$start->json('userCode')}/approve")
            ->assertRedirect();
        $grant = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertOk();

        $this->assertNotEmpty($grant->json('grant'));
        $this->assertStringNotContainsString(
            (string) $grant->json('grant'),
            (string) json_encode(DeviceGrant::query()->sole()->getAttributes()),
        );
    }

    public function test_the_approval_window_reads_the_committed_state_of_the_request(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'start-1'])->assertCreated();
        $window = "/connections/devices/{$start->json('userCode')}";

        $this->actingAs($this->owner)->get($window)->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.state', 'pending')
            ->where('page.data.journalOrigin', 'https://journal.example.com')
            ->where('page.data.isBindingRevoked', false));
        $this->actingAs($this->owner)->post("/project-connections/devices/{$start->json('userCode')}/approve");

        $this->actingAs($this->owner)->get($window)->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.state', 'approved'));
        $this->actingAs($this->owner)
            ->postJson("/project-connections/devices/{$start->json('userCode')}/approve")
            ->assertNotFound();
    }

    public function test_an_approved_grant_authenticates_its_approver_for_its_own_binding_only(): void
    {
        $binding = $this->connected();
        $grant = $this->approvedGrant($binding);

        $command = $this->deviceCommand($grant, $binding)->assertForbidden();
        $this->assertStringContainsString(self::SESSION_USE_REFUSAL, (string) $command->json('message'));

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
        $this->assertStringContainsString(self::REVOKED_REFUSAL, (string) $refusal->json('message'));
    }

    public function test_the_support_record_of_an_install_approval_and_revoke_names_ids_and_holds_no_secret(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->actingAs($this->owner)->post("/project-connections/devices/{$start->json('userCode')}/approve");
        $deviceCode = (string) $start->json('deviceCode');
        $grant = (string) $this->relay('/api/device-grants/poll', ['deviceCode' => $deviceCode])->json('grant');
        $this->actingAs($this->owner)->deleteJson("/project-connections/bindings/{$binding}")->assertOk();

        $audits = array_reverse(ConnectionAudit::findNewestOfBindings([$binding]));
        $project = ProjectBinding::query()->findOrFail($binding)->project_id;

        $this->assertSame(
            [ConnectionAuditType::Redeemed, ConnectionAuditType::DeviceApproved, ConnectionAuditType::BindingRevoked],
            array_map(fn (ConnectionAudit $audit) => $audit->type, $audits),
        );
        $this->assertSame(
            [$project, $project, $project],
            array_map(fn (ConnectionAudit $audit) => $audit->project_id, $audits),
        );
        $stored = (string) json_encode(array_map(fn (ConnectionAudit $audit) => $audit->getAttributes(), $audits));

        $secrets = [
            $grant,
            $deviceCode,
            (string) $start->json('userCode'),
            $this->relayCredential(self::NONCE),
            'the-ticket',
        ];

        foreach ($secrets as $secret) {
            $this->assertStringNotContainsString($secret, $stored);
        }
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

    private function approvedGrant(string $binding): string
    {
        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->actingAs($this->owner)->post("/project-connections/devices/{$start->json('userCode')}/approve");

        return (string) $this->relay(
            '/api/device-grants/poll',
            ['deviceCode' => $start->json('deviceCode')],
        )->json('grant');
    }
}
