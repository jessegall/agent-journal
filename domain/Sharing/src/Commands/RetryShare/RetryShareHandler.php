<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\RetryShare;

use App\Contracts\Sharing\SharePolicy;
use App\Support\ActorIdentity;
use Domain\Sharing\Commands\Support\SharingCommandHandler;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Support\ShareSummary;

/**
 * Locks the share, puts a pending or failed share back to pending, and requests a fresh open of its gateway with an
 * audit; the token and the deadline stay the same.
 */
final readonly class RetryShareHandler extends SharingCommandHandler
{
    public function __construct(
        private SharePolicy $policy,
    ) {}

    public function handle(RetryShareCommand $command): ShareSummary
    {
        $owner = $command->dispatchedBy();
        $this->policy->assertManager($owner);
        $share = Share::ownForUpdate($command->shareId);
        $share->retryOpening();

        $configurationId = $share->gatewayConfigurationId();
        $configuration = ShareGatewayConfiguration::usable($configurationId);

        ShareGatewayOperation::createForConfiguration($configuration, GatewayOperationType::Open);
        ShareAudit::create($share, ShareAuditType::Retried, ActorIdentity::of($owner), null);

        return $share->summary;
    }
}
