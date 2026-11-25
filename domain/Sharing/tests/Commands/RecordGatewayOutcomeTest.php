<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use Domain\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use Domain\Sharing\Commands\RecordGatewayHealth\RecordGatewayHealthCommand;
use Domain\Sharing\Commands\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use Domain\Sharing\Enums\GatewayEndpointStatus;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\GatewayOutcome;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Exceptions\GatewayLeaseRefused;
use Domain\Sharing\Exceptions\GatewayRunStale;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayEndpoint;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Support\ClaimedGatewayOperation;
use Domain\Sharing\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\TestShares;
use Tests\Support\TestActors;

/**
 * A gateway run reports how its operation went: an outcome under an expired lease or from a run that was taken over
 * activates nothing, a replay activates and audits once, a failed open fails the pending share once, and an open after
 * the share ended keeps it ended and asks for a close.
 */
final class RecordGatewayOutcomeTest extends TestCase
{
    use RefreshHookDatabase;
    use RunsTrustedCommands;

    private const string FIRST_RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    private const string SECOND_RUN = '01JD8X0G9M3QZ6V4K2RUN0000B';

    private ShareGatewayConfiguration $configuration;

    private Share $share;

    protected function setUp(): void
    {
        parent::setUp();

        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->share = TestShares::grantForADay(TestActors::record('binders.binder', 1), $this->configuration);
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
            [
                2,
                GatewayEndpointStatus::Opening,
            ],
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
        $this->assertSame([
            GatewayOperationType::Close,
            1,
        ], [
            $close?->type,
            $close?->operation->endpointVersion,
        ]);
        $this->assertSame(GatewayEndpointStatus::Closing, ShareGatewayEndpoint::query()->sole()->status);

        $this->outcome(self::FIRST_RUN, $close, GatewayOutcome::Succeeded);
        $this->assertSame(GatewayEndpointStatus::Closed, ShareGatewayEndpoint::query()->sole()->status);
    }

    private function claim(string $runId): ClaimedGatewayOperation|null
    {
        return $this->asSystem(new ClaimGatewayOperationCommand($runId));
    }

    private function outcome(string $runId, ClaimedGatewayOperation|null $claim, GatewayOutcome $outcome): void
    {
        $this->assertNotNull($claim);
        $this->asSystem(
            new RecordGatewayOutcomeCommand(
                $runId,
                $claim->operation->operationId,
                $claim->operation->endpointVersion,
                $claim->operation->leaseToken,
                $outcome,
            ),
        );
    }

    private function health(string $runId, int $endpointVersion): void
    {
        $this->asSystem(new RecordGatewayHealthCommand($runId, $this->configuration->id, $endpointVersion, true));
    }

    /**
     * @return list<ShareAuditType>
     */
    private function auditTypes(): array
    {
        return array_values(
            ShareAudit::query()->orderBy('id')->readAll('a few audits')->get()->map(
                fn (ShareAudit $audit) => $audit->type,
            )->all(),
        );
    }
}
