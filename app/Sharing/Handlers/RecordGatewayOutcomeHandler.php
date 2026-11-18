<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Sharing\Commands\RecordGatewayOutcome;
use App\Sharing\Enums\GatewayEndpointState;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Events\ShareActivated;
use App\Sharing\Events\ShareFailed;
use App\Sharing\Exceptions\GatewayLeaseRefused;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Models\ShareInstallation;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Locks the installation, configuration, endpoint, the affected shares by id and the operation, in that order, and
 * checks the run still holds the gateways and the operation under this endpoint version and lease. An opened endpoint
 * serves the configuration's waiting shares, which become active once each; a failed open fails the pending ones; a
 * close ends the endpoint. A replay of a recorded outcome under the same lease writes nothing. No I/O happens here.
 */
final readonly class RecordGatewayOutcomeHandler implements CommandHandler
{
    public function __construct(private Dispatcher $events) {}

    public function handle(RecordGatewayOutcome $command): void
    {
        ShareInstallation::lockForAdmission()->requireRun($command->runId);
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
    private function opened(ShareGatewayEndpoint $endpoint, ShareGatewayConfiguration $configuration, array $shares): void
    {
        $endpoint->moveTo(GatewayEndpointState::Open);

        foreach ($shares as $share) {
            $share->activate();
            ShareAudit::recordFor($share, ShareAuditType::Activated, ActorIdentity::system(), null);
            $this->events->dispatch(new ShareActivated($share->fact()));
        }

        if (! Share::anyLiveOn($configuration->id)) {
            ShareGatewayOperation::request($configuration, GatewayOperationType::Close);
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
            ShareAudit::recordFor($share, ShareAuditType::ActivationFailed, ActorIdentity::system(), 'gateway_open_failed');
            $this->events->dispatch(new ShareFailed($share->fact()));
        }
    }
}
