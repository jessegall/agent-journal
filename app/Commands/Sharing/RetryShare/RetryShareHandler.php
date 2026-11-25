<?php

declare(strict_types=1);

namespace App\Commands\Sharing\RetryShare;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Sharing\SharePolicy;
use App\Enums\GatewayOperationType;
use App\Enums\ShareAuditType;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayOperation;
use App\Support\ActorIdentity;
use App\Support\ShareSummary;

/**
 * Locks the share, puts a pending or failed share back to pending, and requests a fresh open of its gateway with an
 * audit; the token and the deadline stay the same.
 */
final readonly class RetryShareHandler implements CommandHandler
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

        return $share->summary();
    }
}
