<?php

declare(strict_types=1);

namespace Tests\Commands\Sharing;

use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayOperation;
use App\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Support\ClaimedGatewayOperation;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestActors;

/**
 * A gateway run claims the next operation under a ninety second lease on a new endpoint version.
 */
#[TestsCommand(ClaimGatewayOperationCommand::class)]
final class ClaimGatewayOperationTest extends SharingTestCase
{
    use RefreshHookDatabase;

    private const string HELD_OPERATION = 'A held operation is not claimed again.';

    private const string FIRST_RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    private ShareGatewayConfiguration $configuration;

    private Share $share;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->share = $this->grantForADay(TestActors::record('binders.binder', 1), $this->configuration);
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
