<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\DisableShareGateway;

use App\Access\Contracts\SharePolicy;
use Domain\Sharing\Commands\Support\SharingCommandHandler;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\GatewayOutcome;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayEndpoint;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Models\ShareInstallation;
use Domain\Sharing\Support\Gateways\GatewayConfiguration;
use Domain\Sharing\Support\ShareEndings;

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
