<?php

declare(strict_types=1);

namespace Tests\Feature\Connections;

use App\Commands\Assignments\AssignRecord\AssignRecordCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Enums\Connections\ConnectionAuditType;
use App\Models\Access\User;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\DeviceGrant;
use App\Models\Projects\ProjectBinding;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\AssigneeIdentity;
use App\Support\RequestKey;
use App\Values\OwnerAuthority;
use Domain\Tasks\Models\Task;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\DomainBoot;
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

    private const string SESSION_USE_REFUSAL = 'runs in a provider session';

    private const string REVOKED_REFUSAL = 'can no longer use the journal';

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
        $this->app->make(CommandBus::class)->run(new AssignRecordCommand($task->assignmentIdentity(), $holder));
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

        $secrets = [$grant, $deviceCode, (string) $start->json('userCode'), $this->relayCredential(self::NONCE), 'the-ticket'];

        foreach ($secrets as $secret) {
            $this->assertStringNotContainsString($secret, $stored);
        }
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
            (string) Str::uuid(),
        );
    }
}
