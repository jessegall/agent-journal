<?php

declare(strict_types=1);

namespace Tests\Commands\Projects;

use App\Commands\Projects\ApproveDeviceGrant\ApproveDeviceGrantCommand;
use App\Commands\Projects\RevokeProjectBinding\RevokeProjectBindingCommand;
use App\Enums\Connections\ConnectionAuditType;
use App\Enums\Projects\DeviceGrantStatus;
use App\Exceptions\DeviceGrantRefused;
use App\Models\Projects\ConnectionAudit;
use App\Models\Projects\DeviceGrant;
use App\Models\Projects\ProjectBinding;
use Domain\Tasks\TasksDomain;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Tests\Support\CommitsHookRows;
use Tests\Support\Connections\ConnectsProjects;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\TestCase;

/**
 * The shell gets a url and a code and its grant once the owner approves; the approval window reads the committed
 * state of the request.
 */
#[TestsCommand(ApproveDeviceGrantCommand::class)]
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
        $this->journal->asOwner(new ApproveDeviceGrantCommand((string) $start->json('userCode')));
        $grant = $this->relay('/api/device-grants/poll', ['deviceCode' => $start->json('deviceCode')])->assertOk();

        $this->assertNotEmpty($grant->json('grant'));
        $this->assertStringNotContainsString(
            (string) $grant->json('grant'),
            (string) json_encode(DeviceGrant::query()->sole()->getAttributes()),
        );
    }

    public function test_an_approval_moves_the_request_on_and_a_second_is_refused(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding, 'startKey' => 'start-1'])->assertCreated();
        $approval = new ApproveDeviceGrantCommand((string) $start->json('userCode'));
        $this->assertSame(DeviceGrantStatus::Pending, DeviceGrant::query()->sole()->status);

        $this->journal->asOwner($approval);

        $this->assertSame(DeviceGrantStatus::Approved, DeviceGrant::query()->sole()->status);
        $this->journal->assertRefused(DeviceGrantRefused::class, fn () => $this->journal->asOwner($approval));
    }

    public function test_the_support_record_of_an_install_approval_and_revoke_names_ids_and_holds_no_secret(): void
    {
        $binding = $this->connected();
        $start = $this->relay('/api/device-grants', ['binding' => $binding])->assertCreated();
        $this->journal->asOwner(new ApproveDeviceGrantCommand((string) $start->json('userCode')));
        $deviceCode = (string) $start->json('deviceCode');
        $grant = (string) $this->relay('/api/device-grants/poll', ['deviceCode' => $deviceCode])->json('grant');
        $this->journal->asOwner(new RevokeProjectBindingCommand($binding));

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
}
