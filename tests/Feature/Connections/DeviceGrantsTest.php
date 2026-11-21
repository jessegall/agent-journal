<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Agents\Enums\HostProtocolVersion;
use App\Assignments\Commands\AssignRecord;
use App\Assignments\Support\AssigneeIdentity;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Connections\Enums\BindingReadiness;
use App\Connections\Enums\ConnectionAuditType;
use App\Connections\Models\ConnectionAudit;
use App\Connections\Models\DeviceGrant;
use App\Connections\Models\ProjectBinding;
use App\Connections\Values\InstallTicket;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Tasks\Models\Task;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
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
        'assignments', 'tasks', 'command_receipts', 'device_grants', 'connection_audits', 'project_invitations',
        'install_attempts', 'project_bindings', 'project_environments', 'projects', 'agent_runtimes', 'agents', 'hosts',
        'settings_records', 'users',
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
        $expired = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(410);
        $this->assertSame('expired_token', $expired->json('details.outcome'));
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

    public function test_revoking_one_terminal_sign_in_leaves_the_other_working(): void
    {
        $binding = $this->connected();
        $first = $this->approvedGrant($binding);
        $second = $this->approvedGrant($binding);
        $revoked = DeviceGrant::query()->where('grant_digest', InstallTicket::digestOf($first))->sole();

        $this->actingAs($this->owner)
            ->deleteJson("/settings/project-connections/devices/{$revoked->id}")
            ->assertNoContent();

        $this->actingAs($this->owner)->get('/connections')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->has('page.data.bindings.rows.0.signIns', 2)
            ->where('page.data.bindings.rows.0.signIns.1.reference', $revoked->reference)
            ->where('page.data.bindings.rows.0.signIns.1.state', 'revoked'));
        $this->deviceCommand($first, $binding)->assertUnauthorized();
        $this->deviceCommand($second, $binding)->assertForbidden();
    }

    public function test_overview_in_a_terminal_shows_the_users_tasks_of_its_environment_only(): void
    {
        $binding = $this->connected();
        $grant = $this->approvedGrant($binding);
        $environment = (string) ProjectBinding::query()->findOrFail($binding)->environment_id;
        $here = Task::factory()->create(['title' => 'Review the release', 'environment_id' => $environment]);
        $elsewhere = Task::factory()->create(['title' => 'Ship the release', 'environment_id' => 'production-environment']);
        $this->assignToOwner($here);
        $this->assignToOwner($elsewhere);

        $overview = $this->overview($grant, $binding, ['overview'])->assertOk();

        $this->assertSame(1, $overview->json('count'));
        $this->assertSame([['number' => $here->number, 'title' => 'Review the release']], $overview->json('tasks'));
        $this->assertSame('Main', $overview->json('environment'));
        $this->overview($grant, $binding, ['overview', 'extra'])->assertForbidden();
    }

    private function assignToOwner(Task $task): void
    {
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($this->owner->id), new OwnerAuthority('test'));
        $this->app->make(RequestKey::class)->set((string) Str::ulid());
        $holder = AssigneeIdentity::of(ActorContext::forUser($this->owner->id));
        $this->app->make(CommandBus::class)->run(new AssignRecord($task->assignmentIdentity(), $holder));
    }

    /**
     * @param  list<string>  $argv
     */
    private function overview(string $grant, string $binding, array $argv): TestResponse
    {
        $this->app['auth']->forgetGuards();
        $this->app->forgetScopedInstances();

        return $this->postJson('https://localhost/api/project-commands/device', [
            'request_key' => 'request-'.count($argv),
            'binding' => $binding,
            'argv' => $argv,
            'stdin' => '',
        ], ['Authorization' => "Bearer {$grant}"]);
    }

    public function test_the_support_record_of_an_install_approval_and_revoke_names_ids_and_holds_no_secret(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->actingAs($this->owner)->post("/settings/project-connections/devices/{$start->json('userCode')}/approve");
        $deviceCode = (string) $start->json('deviceCode');
        $grant = (string) $this->relay('/api/device-grants/poll', ['deviceCode' => $deviceCode])->json('grant');
        $this->actingAs($this->owner)->deleteJson("/settings/project-connections/bindings/{$binding}")->assertOk();

        $audits = array_reverse(ConnectionAudit::newestOfBindings([$binding]));
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

        $secrets = [$grant, $deviceCode, (string) $start->json('userCode'), $this->relayCredential(self::NONCE), 'the-ticket'];

        foreach ($secrets as $secret) {
            $this->assertStringNotContainsString($secret, $stored);
        }
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

    public function test_a_poll_too_soon_slows_down_and_keeps_the_request_waiting(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'start-1'])->assertCreated();
        $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(428);

        $slow = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(429);

        $this->assertSame('slow_down', $slow->json('details.outcome'));
        $this->assertSame(DeviceGrant::POLL_SECONDS_MINIMUM, $slow->json('details.interval'));
        $this->travel(DeviceGrant::POLL_SECONDS_MINIMUM + 1)->seconds();
        $pending = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(428);
        $this->assertSame('authorization_pending', $pending->json('details.outcome'));
    }

    public function test_a_lost_successful_poll_answers_already_issued_with_the_reference(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'start-1'])->assertCreated();
        $this->actingAs($this->owner)->post("/settings/project-connections/devices/{$start->json('userCode')}/approve");
        $this->app['auth']->forgetGuards();
        $issued = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertOk();

        $this->travel(DeviceGrant::POLL_SECONDS_MINIMUM + 1)->seconds();
        $again = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertStatus(409);

        $this->assertSame('issued', $issued->json('outcome'));
        $this->assertSame('already_issued', $again->json('details.outcome'));
        $this->assertSame($start->json('reference'), $again->json('details.reference'));
        $this->assertNull($again->json('grant'));
    }

    public function test_two_terminals_get_two_references_and_a_repeated_start_finds_its_own(): void
    {
        $binding = $this->connected();

        $first = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'terminal-a'])->assertCreated();
        $second = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'terminal-b'])->assertCreated();
        $again = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'terminal-a'])->assertCreated();

        $this->assertNotSame($first->json('reference'), $second->json('reference'));
        $this->assertSame([1, 2], [$first->json('generation'), $second->json('generation')]);
        $this->assertSame($first->json('reference'), $again->json('reference'));
        $this->assertSame(2, DeviceGrant::query()->count());
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
        $this->actingAs($this->owner)->post("/settings/project-connections/devices/{$start->json('userCode')}/approve");

        $this->actingAs($this->owner)->get($window)->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.state', 'approved'));
        $this->actingAs($this->owner)
            ->postJson("/settings/project-connections/devices/{$start->json('userCode')}/approve")
            ->assertNotFound();
    }

    public function test_an_expired_code_reads_expired_in_the_approval_window(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'start-1'])->assertCreated();

        $this->travel(DeviceGrant::CODE_MINUTES + 1)->minutes();

        $this->actingAs($this->owner)
            ->get("/connections/devices/{$start->json('userCode')}")
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page->where('page.data.state', 'expired'));
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
