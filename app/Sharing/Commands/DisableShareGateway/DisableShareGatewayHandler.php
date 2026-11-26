<?php

declare(strict_types=1);

namespace App\Sharing\Commands\DisableShareGateway;

use App\Access\Contracts\SharePolicy;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayEndpoint;
use App\Models\Sharing\ShareGatewayOperation;
use App\Models\Sharing\ShareInstallation;
use App\Sharing\Commands\Support\SharingCommandHandler;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\GatewayOutcome;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Support\Gateways\GatewayConfiguration;
use App\Sharing\Support\ShareEndings;

/**
 * Locks the installation, the configuration and its unended shares by id; revokes every one of them, then cancels the
 * configuration's waiting opens, requests a close when an endpoint still runs, disables the configuration and audits
 * the change, all in one transaction.
 */
final readonly class DisableShareGatewayHandler extends SharingCommandHandler
{
    public function __construct(
        private SharePolicy $policy,
        private ShareEndings $endings,
    ) {}

    public function handle(DisableShareGatewayCommand $command): GatewayConfiguration
    {
        $owner = $command->dispatchedBy();
        $this->policy->assertManager($owner);
        ShareInstallation::create();
        $configuration = ShareGatewayConfiguration::findLockedById($command->configurationId);

        $actor = $owner;
        $this->endings->revokeAll(Share::findLockedUnendedOf($configuration->id), $actor);
        $this->cancelOpensOf($configuration);

        if (ShareGatewayEndpoint::hasAnyRunningOf($configuration)) {
            ShareGatewayOperation::create($configuration, GatewayOperationType::Close);
        }

        $configuration->disable();
        ShareAudit::create(null, ShareAuditType::GatewayChanged, $actor, 'disabled');

        return $configuration->toConfiguration;
    }

    /**
     * Ends every unfinished request to open the configuration's endpoint as failed: the gateway was disabled.
     */
    private function cancelOpensOf(ShareGatewayConfiguration $configuration): void
    {
        ShareGatewayOperation::query()
            ->unfinished()
            ->ofConfiguration($configuration->id)
            ->ofType(GatewayOperationType::Open)
            ->update(['outcome_code' => GatewayOutcome::Failed->value]);
    }
}
