<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Sharing\Commands\ClaimGatewayOperation;
use App\Sharing\Commands\RecordGatewayHealth;
use App\Sharing\Commands\RecordGatewayOutcome;
use App\Sharing\Enums\GatewayEndpointState;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Exceptions\GatewayLeaseRefused;
use App\Sharing\Exceptions\GatewayRunStale;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Support\ClaimedGatewayOperation;
use Carbon\CarbonImmutable;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\TestShares;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * The supervisor's three committed steps: it claims an operation under a 90-second lease, reports its outcome under
 * the same run, version and lease, and reports endpoint health. A newer run takes the gateways over and fences the
 * older one; an expired lease activates nothing; a replayed outcome audits once; health never moves a deadline.
 */
final class GatewayRuntimeTest extends TestCase
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

        $this->configuration = ShareGatewayConfiguration::configure(FakeShareGateway::settings());
        $this->share = TestShares::grantForADay(TestActors::record('binders.binder', 1), $this->configuration);
        ShareGatewayOperation::request($this->configuration, GatewayOperationType::Open);
    }

    public function test_a_claim_takes_the_operation_under_a_ninety_second_lease_on_a_new_endpoint_version(): void
    {
        $claim = $this->claim(self::FIRST_RUN);

        $this->assertSame(GatewayOperationType::Open, $claim->type);
        $this->assertSame(1, $claim->operation->endpointVersion);
        $this->assertSame(64, strlen($claim->operation->leaseToken));
        $this->assertEqualsWithDelta(
            CarbonImmutable::now()->addSeconds(90)->getTimestamp(),
            $claim->operation->leaseEndsAt,
            2,
        );
        $this->assertSame($this->configuration->id, $claim->operation->configuration->configurationId);
        $this->assertNull($this->claim(self::FIRST_RUN), 'A held operation is not claimed again.');
    }

    public function test_an_outcome_under_an_expired_lease_activates_nothing(): void
    {
        $claim = $this->claim(self::FIRST_RUN);
        $this->travel(91)->seconds();

        $this->assertThrows(
            fn () => $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Succeeded),
            GatewayLeaseRefused::class,
        );
        $this->assertSame(ShareState::Pending, $this->share->fresh()?->state);
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
            [2, GatewayEndpointState::Opening],
            [$taken?->operation->endpointVersion, ShareGatewayEndpoint::query()->where('endpoint_version', 2)->sole()->state],
        );
        $this->assertSame(
            GatewayEndpointState::Closed,
            ShareGatewayEndpoint::query()->where('endpoint_version', 1)->sole()->state,
        );
        $this->assertSame(ShareState::Pending, $this->share->fresh()?->state);
    }

    public function test_a_replayed_outcome_activates_once_and_audits_once(): void
    {
        $claim = $this->claim(self::FIRST_RUN);

        $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Succeeded);
        $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Succeeded);

        $this->assertSame(ShareState::Active, $this->share->fresh()?->state);
        $this->assertSame(GatewayEndpointState::Open, ShareGatewayEndpoint::query()->sole()->state);
        $this->assertSame([ShareAuditType::Activated], $this->auditTypes());
    }

    public function test_a_failed_open_fails_the_pending_share_once(): void
    {
        $claim = $this->claim(self::FIRST_RUN);

        $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Failed);

        $this->assertSame(ShareState::Failed, $this->share->fresh()?->state);
        $this->assertSame([ShareAuditType::ActivationFailed], $this->auditTypes());
    }

    public function test_an_open_after_the_share_ended_keeps_it_ended_and_requests_a_close(): void
    {
        $claim = $this->claim(self::FIRST_RUN);
        $this->share->end(ShareState::Revoked);

        $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Succeeded);

        $this->assertSame(ShareState::Revoked, $this->share->fresh()?->state);
        $close = $this->claim(self::FIRST_RUN);
        $this->assertSame([GatewayOperationType::Close, 1], [$close?->type, $close?->operation->endpointVersion]);
        $this->assertSame(GatewayEndpointState::Closing, ShareGatewayEndpoint::query()->sole()->state);

        $this->outcome(self::FIRST_RUN, $close, GatewayOutcome::Succeeded);
        $this->assertSame(GatewayEndpointState::Closed, ShareGatewayEndpoint::query()->sole()->state);
    }

    public function test_health_notes_a_healthy_endpoint_and_never_moves_a_deadline(): void
    {
        $claim = $this->claim(self::FIRST_RUN);
        $this->outcome(self::FIRST_RUN, $claim, GatewayOutcome::Succeeded);
        $deadline = $this->share->fresh()?->expires_at;

        $this->health(self::FIRST_RUN, 1);

        $this->assertNotNull(ShareGatewayEndpoint::query()->sole()->last_health_at);
        $this->assertEquals($deadline, $this->share->fresh()?->expires_at);
        $this->assertThrows(fn () => $this->health(self::FIRST_RUN, 2), GatewayLeaseRefused::class);
    }

    private function claim(string $runId): ClaimedGatewayOperation|null
    {
        return $this->asSystem(new ClaimGatewayOperation($runId));
    }

    private function outcome(string $runId, ClaimedGatewayOperation|null $claim, GatewayOutcome $outcome): void
    {
        $this->assertNotNull($claim);
        $this->asSystem(
            new RecordGatewayOutcome($runId, $claim->operation->operationId, $claim->operation->endpointVersion, $claim->operation->leaseToken, $outcome),
        );
    }

    private function health(string $runId, int $endpointVersion): void
    {
        $this->asSystem(new RecordGatewayHealth($runId, $this->configuration->id, $endpointVersion, true));
    }

    /**
     * @return list<ShareAuditType>
     */
    private function auditTypes(): array
    {
        return array_values(
            ShareAudit::query()->orderBy('id')->readAll('a few audits')->get()->map(fn (ShareAudit $audit) => $audit->type)->all(),
        );
    }
}
