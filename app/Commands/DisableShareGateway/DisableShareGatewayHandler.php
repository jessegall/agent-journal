<?php

declare(strict_types=1);

namespace App\Commands\DisableShareGateway;

use App\Contracts\CommandHandler;
use App\Contracts\SharePolicy;
use App\Enums\GatewayOperationType;
use App\Enums\GatewayOutcome;
use App\Enums\ShareAuditType;
use App\Models\Share;
use App\Models\ShareAudit;
use App\Models\ShareGatewayConfiguration;
use App\Models\ShareGatewayEndpoint;
use App\Models\ShareGatewayOperation;
use App\Models\ShareInstallation;
use App\Support\ActorIdentity;
use App\Support\GatewayConfiguration;
use App\Support\ShareEndings;

/**
 * Locks the installation, the configuration and its unended shares by id; revokes every one of them, then cancels the
 * configuration's waiting opens, requests a close when an endpoint still runs, disables the configuration and audits
 * the change, all in one transaction.
 */
final readonly class DisableShareGatewayHandler implements CommandHandler
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
        $configuration = ShareGatewayConfiguration::lockById($command->configurationId);

        $actor = ActorIdentity::of($owner);
        $this->endings->revokeAll(Share::lockUnendedOf($configuration->id), $actor);
        $this->cancelOpensOf($configuration);

        if (ShareGatewayEndpoint::anyRunningOf($configuration)) {
            ShareGatewayOperation::create($configuration, GatewayOperationType::Close);
        }

        $configuration->disable();
        ShareAudit::create(null, ShareAuditType::GatewayChanged, $actor, 'disabled');

        return $configuration->toConfiguration();
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
