<?php

declare(strict_types=1);

namespace Tests\Commands\Sharing;

use App\Events\Sharing\ShareActivated;
use App\Events\Sharing\ShareRevoked;
use App\Events\Web\PageChanged;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayEndpoint;
use App\Models\Sharing\ShareGatewayOperation;
use App\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Sharing\Commands\RecordGatewayHealth\RecordGatewayHealthCommand;
use App\Sharing\Commands\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use App\Sharing\Enums\GatewayEndpointStatus;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareStatus;
use App\Sharing\Exceptions\GatewayLeaseRefused;
use App\Sharing\Exceptions\GatewayRunStale;
use App\Sharing\Support\ClaimedGatewayOperation;
use App\Support\RecordIdentity;
use Illuminate\Support\Facades\Event;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestActors;

/**
 * A gateway run reports how its operation went: an outcome under an expired lease or from a run that was taken over
 * activates nothing, a replay activates and audits once, a failed open fails the pending share once, and an open after
 * the share ended keeps it ended and asks for a close.
 */
#[TestsCommand(RecordGatewayOutcomeCommand::class)]
final class RecordGatewayOutcomeTest extends SharingTestCase
{
    use CommitsHookRows;

    private const string FIRST_RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    private const string SECOND_RUN = '01JD8X0G9M3QZ6V4K2RUN0000B';

    private ShareGatewayConfiguration $configuration;

    private Share $share;

    private const array TABLES = [
        'command_receipts',
        'share_audits',
        'share_members',
        'share_gateway_operations',
        'shares',
        'share_gateway_endpoints',
        'share_gateway_configurations',
        'share_installations',
        'number_groups',
    ];

    private const string RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    /**
     * @var list<object>
     */
    private array $received = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->share = $this->grantForADay(TestActors::record('binders.binder', 1), $this->configuration);
        ShareGatewayOperation::create($this->configuration, GatewayOperationType::Open);
    }

    public function test_an_outcome_under_an_expired_lease_activates_nothing(): void
    {
        $claim = $this->claim(self::FIRST_RUN);
        $this->travel(91)->seconds();

        $this->assertThrows(
            fn () => $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Succeeded),
            GatewayLeaseRefused::class,
        );

        $this->assertSame(ShareStatus::Pending, $this->share->fresh()?->status);
    }

    public function test_a_second_run_takes_over_the_operation_and_fences_the_first_runs_outcome_and_health(): void
    {
        $claim = $this->claim(self::FIRST_RUN);
        $taken = $this->claim(self::SECOND_RUN);

        $this->assertThrows(
            fn () => $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Succeeded),
            GatewayRunStale::class,
        );

        $this->assertThrows(fn () => $this->health(self::FIRST_RUN, 1), GatewayRunStale::class);
        $this->assertThrows(fn () => $this->claim(self::FIRST_RUN), GatewayRunStale::class);

        $this->assertSame(
            [2, GatewayEndpointStatus::Opening],
            [
                $taken?->operation->endpointVersion,
                ShareGatewayEndpoint::query()->where('endpoint_version', 2)->sole()->status,
            ],
        );

        $this->assertSame(
            GatewayEndpointStatus::Closed,
            ShareGatewayEndpoint::query()->where('endpoint_version', 1)->sole()->status,
        );

        $this->assertSame(ShareStatus::Pending, $this->share->fresh()?->status);
    }

    public function test_a_replayed_outcome_activates_once_and_audits_once(): void
    {
        $claim = $this->claim(self::FIRST_RUN);

        $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Succeeded);
        $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Succeeded);

        $this->assertSame(ShareStatus::Active, $this->share->fresh()?->status);
        $this->assertSame(GatewayEndpointStatus::Open, ShareGatewayEndpoint::query()->sole()->status);
        $this->assertSame([ShareAuditType::Activated], $this->auditTypes());
    }

    public function test_a_failed_open_fails_the_pending_share_once(): void
    {
        $claim = $this->claim(self::FIRST_RUN);

        $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Failed);

        $this->assertSame(ShareStatus::Failed, $this->share->fresh()?->status);
        $this->assertSame([ShareAuditType::ActivationFailed], $this->auditTypes());
    }

    public function test_an_open_after_the_share_ended_keeps_it_ended_and_requests_a_close(): void
    {
        $claim = $this->claim(self::FIRST_RUN);
        $this->share->end(ShareStatus::Revoked);

        $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Succeeded);

        $this->assertSame(ShareStatus::Revoked, $this->share->fresh()?->status);
        $close = $this->claim(self::FIRST_RUN);

        $this->assertSame([GatewayOperationType::Close, 1], [$close?->type, $close?->operation->endpointVersion]);

        $this->assertSame(GatewayEndpointStatus::Closing, ShareGatewayEndpoint::query()->sole()->status);

        $this->outcome(self::FIRST_RUN, $close, GatewayOutcome::Succeeded);
        $this->assertSame(GatewayEndpointStatus::Closed, ShareGatewayEndpoint::query()->sole()->status);
    }

    public function test_share_activated_reaches_a_listener_after_commit_once_and_not_on_a_replay(): void
    {
        Event::listen([ShareActivated::class, ShareRevoked::class], function (object $event): void {
            $this->received[] = $event;
        });

        $claim = $this->journal->asSystem(new ClaimGatewayOperationCommand(self::RUN));
        $this->assertInstanceOf(ClaimedGatewayOperation::class, $claim);

        $outcome = new RecordGatewayOutcomeCommand(
            self::RUN,
            $claim->operation->operationId,
            $claim->operation->endpointVersion,
            $claim->operation->leaseToken,
            GatewayOutcome::Succeeded,
        );

        $this->journal->asSystem($outcome);
        $this->journal->asSystem($outcome);

        $this->assertCount(1, $this->received);
        $this->assertInstanceOf(ShareActivated::class, $this->received[0]);

        $this->assertSame(
            [$this->share->id, $this->configuration->id, ShareStatus::Active, Share::FIRST_SCOPE_VERSION],
            [
                $this->received[0]->share->shareId,
                $this->received[0]->share->configurationId,
                $this->received[0]->share->status,
                $this->received[0]->share->scopeVersion,
            ],
        );

        $this->assertStringNotContainsString(
            (string) $this->share->fresh()?->token_ciphertext,
            serialize($this->received[0]),
        );
    }

    public function test_activating_a_share_sends_the_owner_a_page_change_with_nothing_in_it(): void
    {
        $claim = $this->journal->asSystem(new ClaimGatewayOperationCommand(self::RUN));
        $this->assertInstanceOf(ClaimedGatewayOperation::class, $claim);
        Event::fake([PageChanged::class]);

        $this->journal->asSystem(new RecordGatewayOutcomeCommand(
            self::RUN,
            $claim->operation->operationId,
            $claim->operation->endpointVersion,
            $claim->operation->leaseToken,
            GatewayOutcome::Succeeded,
        ));

        Event::assertDispatched(
            PageChanged::class,
            fn (PageChanged $change) => $change->userIds === [
                $this->journal->ownerUser()->id,
            ] && $change->broadcastWith() === [],
        );
    }

    private function claim(string $runId): ClaimedGatewayOperation|null
    {
        return $this->journal->asSystem(new ClaimGatewayOperationCommand($runId));
    }

    private function outcome(string $runId, ClaimedGatewayOperation|null $claim, GatewayOutcome $outcome): void
    {
        $this->assertNotNull($claim);

        $this->journal->asSystem(new RecordGatewayOutcomeCommand(
            $runId,
            $claim->operation->operationId,
            $claim->operation->endpointVersion,
            $claim->operation->leaseToken,
            $outcome,
        ));
    }

    private function health(string $runId, int $endpointVersion): void
    {
        $this->journal->asSystem(
            new RecordGatewayHealthCommand($runId, $this->configuration->id, $endpointVersion, true),
        );
    }

    /**
     * @return list<ShareAuditType>
     */
    private function auditTypes(): array
    {
        return array_values(
            ShareAudit::query()->orderBy('id')->get()->map(
                fn (ShareAudit $audit) => $audit->type,
            )->all(),
        );
    }

    /**
     * A share the journal's owner granted on the root for a day, kept under the root's reference.
     */
    private function grantForADay(RecordIdentity $root, ShareGatewayConfiguration $configuration): Share
    {
        $name = $root->reference();

        return $this->journal->shareForADay(
            $name,
            $root,
            $configuration,
        )->shareCalled($name);
    }
}
