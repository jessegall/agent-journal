<?php

declare(strict_types=1);

namespace App\Sharing\Commands\RetryShare;

use App\Access\Contracts\SharePolicy;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayOperation;
use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Support\ShareSummary;

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
        $configuration = ShareGatewayConfiguration::findUsable($configurationId);

        ShareGatewayOperation::create($configuration, GatewayOperationType::Open);
        ShareAudit::create($share, ShareAuditType::Retried, $owner, null);

        return $share->summary;
    }
}
