<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\RecordGatewayOutcome;

use Domain\Sharing\Concerns\RefusesStaleGatewayRuns;
use App\Contracts\Bus\CommandHandler;
use Domain\Sharing\Enums\GatewayEndpointState;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\GatewayOutcome;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Enums\ShareState;
use Domain\Sharing\Exceptions\GatewayLeaseRefused;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayEndpoint;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Models\ShareInstallation;
use App\Support\ActorIdentity;

/**
 * Locks the installation, configuration, endpoint, the affected shares by id and the operation, in that order, and
 * checks the run still holds the gateways and the operation under this endpoint version and lease. An opened endpoint
 * serves the configuration's waiting shares, which become active once each; a failed open fails the pending ones; a
 * close ends the endpoint. A replay of a recorded outcome under the same lease writes nothing. No I/O happens here.
 */
final readonly class RecordGatewayOutcomeHandler implements CommandHandler
{
    use RefusesStaleGatewayRuns;

    public function handle(RecordGatewayOutcomeCommand $command): void
    {
        $this->assertCurrentGatewayRun(ShareInstallation::create(), $command->runId);
        $claimed = ShareGatewayOperation::of($command->operationId);
        $configuration = ShareGatewayConfiguration::lockById($claimed->share_gateway_configuration_id);
        $endpoint = ShareGatewayEndpoint::lockHeldBy($configuration->id, $command->endpointVersion, $command->runId);
        $opens = $claimed->type === GatewayOperationType::Open;
        $shares = $opens ? Share::lockAwaitingGatewayOf($configuration->id) : [];
        $operation = ShareGatewayOperation::lockById($command->operationId);

        if (! $operation->isHeldBy($command->runId, $command->endpointVersion, $command->leaseToken)) {
            throw GatewayLeaseRefused::forOperation($command->operationId);
        }

        if ($operation->hasOutcome()) {
            return;
        }

        if (! $operation->leaseIsLive()) {
            throw GatewayLeaseRefused::forOperation($command->operationId);
        }

        $operation->finish($command->outcome);

        if (! $opens) {
            $endpoint->moveTo(GatewayEndpointState::Closed);

            return;
        }

        if ($command->outcome === GatewayOutcome::Succeeded) {
            $this->opened($endpoint, $configuration, $shares);

            return;
        }

        $this->failed($endpoint, $shares);
    }

    /**
     * @param  list<Share>  $shares
     */
    private function opened(
        ShareGatewayEndpoint $endpoint,
        ShareGatewayConfiguration $configuration,
        array $shares,
    ): void {
        $endpoint->moveTo(GatewayEndpointState::Open);

        foreach ($shares as $share) {
            $share->activate();
            ShareAudit::create($share, ShareAuditType::Activated, ActorIdentity::system(), null);
        }

        if (! Share::hasAnyLiveOn($configuration->id)) {
            ShareGatewayOperation::createForConfiguration($configuration, GatewayOperationType::Close);
        }
    }

    /**
     * Fails the pending shares once; a share that failed before keeps its one audit.
     *
     * @param  list<Share>  $shares
     */
    private function failed(ShareGatewayEndpoint $endpoint, array $shares): void
    {
        $endpoint->moveTo(GatewayEndpointState::Closed);

        foreach ($shares as $share) {
            if ($share->state !== ShareState::Pending) {
                continue;
            }

            $share->failActivation();

            ShareAudit::create(
                $share,
                ShareAuditType::ActivationFailed,
                ActorIdentity::system(),
                'gateway_open_failed',
            );
        }
    }
}
