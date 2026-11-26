<?php

declare(strict_types=1);

namespace App\Sharing\Commands\RecordGatewayOutcome;

use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayEndpoint;
use App\Models\Sharing\ShareGatewayOperation;
use App\Models\Sharing\ShareInstallation;
use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Concerns\RefusesStaleGatewayRuns;
use App\Sharing\Enums\GatewayEndpointStatus;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareStatus;
use App\Sharing\Exceptions\GatewayLeaseRefused;
use App\Support\ActorReference;

/**
 * Locks the installation, configuration, endpoint, the affected shares by id and the operation, in that order, and
 * checks the run still holds the gateways and the operation under this endpoint version and lease. An opened endpoint
 * serves the configuration's waiting shares, which become active once each; a failed open fails the pending ones; a
 * close ends the endpoint. A replay of a recorded outcome under the same lease writes nothing. No I/O happens here.
 */
final readonly class RecordGatewayOutcomeHandler extends SharingCommandHandler
{
    use RefusesStaleGatewayRuns;

    public function handle(RecordGatewayOutcomeCommand $command): void
    {
        $this->assertCurrentGatewayRun(ShareInstallation::create(), $command->runId);
        $claimed = ShareGatewayOperation::findOf($command->operationId);
        $configuration = ShareGatewayConfiguration::findLockedById($claimed->share_gateway_configuration_id);

        $endpoint = ShareGatewayEndpoint::findLockedHeldBy(
            $configuration->id,
            $command->endpointVersion,
            $command->runId,
        );

        $opens = $claimed->type === GatewayOperationType::Open;
        $shares = $opens ? Share::findLockedAwaitingGatewayOf($configuration->id) : [];
        $operation = ShareGatewayOperation::findLockedById($command->operationId);

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
            $endpoint->moveTo(GatewayEndpointStatus::Closed);

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
        $endpoint->moveTo(GatewayEndpointStatus::Open);

        foreach ($shares as $share) {
            $share->activate();
            ShareAudit::create($share, ShareAuditType::Activated, ActorReference::system(), null);
        }

        if (! Share::hasAnyLiveOn($configuration->id)) {
            ShareGatewayOperation::create($configuration, GatewayOperationType::Close);
        }
    }

    /**
     * Fails the pending shares once; a share that failed before keeps its one audit.
     *
     * @param  list<Share>  $shares
     */
    private function failed(ShareGatewayEndpoint $endpoint, array $shares): void
    {
        $endpoint->moveTo(GatewayEndpointStatus::Closed);

        foreach ($shares as $share) {
            if ($share->status !== ShareStatus::Pending) {
                continue;
            }

            $share->failActivation();

            ShareAudit::create(
                $share,
                ShareAuditType::ActivationFailed,
                ActorReference::system(),
                'gateway_open_failed',
            );
        }
    }
}
