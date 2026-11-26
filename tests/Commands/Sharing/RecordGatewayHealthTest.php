<?php

declare(strict_types=1);

namespace Tests\Commands\Sharing;

use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayEndpoint;
use App\Models\Sharing\ShareGatewayOperation;
use App\Sharing\Commands\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Sharing\Commands\RecordGatewayHealth\RecordGatewayHealthCommand;
use App\Sharing\Commands\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Exceptions\GatewayLeaseRefused;
use App\Sharing\Support\ClaimedGatewayOperation;
use App\Support\RecordIdentity;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\SharingTestCase;
use Tests\Support\TestActors;

/**
 * A gateway run notes a healthy endpoint and never moves a share's deadline.
 */
#[TestsCommand(RecordGatewayHealthCommand::class)]
final class RecordGatewayHealthTest extends SharingTestCase
{
    use RefreshHookDatabase;

    private const string FIRST_RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    private ShareGatewayConfiguration $configuration;

    private Share $share;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->share = $this->shareForADay(TestActors::record('binders.binder', 1), $this->configuration);
        ShareGatewayOperation::create($this->configuration, GatewayOperationType::Open);
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
