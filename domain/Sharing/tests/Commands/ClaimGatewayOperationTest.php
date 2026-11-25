<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use Carbon\CarbonImmutable;
use Domain\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Support\ClaimedGatewayOperation;
use Domain\Sharing\Tests\TestCase;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\TestShares;
use Tests\Support\TestActors;

/**
 * A gateway run claims the next operation under a ninety second lease on a new endpoint version.
 */
final class ClaimGatewayOperationTest extends TestCase
{
    use RefreshHookDatabase;

    private const string HELD_OPERATION = 'A held operation is not claimed again.';

    private const string FIRST_RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    private ShareGatewayConfiguration $configuration;

    private Share $share;

    protected function setUp(): void
    {
        parent::setUp();

        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->share = TestShares::grantForADay(TestActors::record('binders.binder', 1), $this->configuration);
        ShareGatewayOperation::create($this->configuration, GatewayOperationType::Open);
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
        $this->assertSame($this->configuration->id, $claim->operation->configurationId());
        $this->assertNull($this->claim(self::FIRST_RUN), self::HELD_OPERATION);
    }

    private function claim(string $runId): ClaimedGatewayOperation|null
    {
        return $this->journal->asSystem(new ClaimGatewayOperationCommand($runId));
    }
}
