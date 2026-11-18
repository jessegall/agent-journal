<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Sharing\Actions\ShareEndings;
use App\Sharing\Commands\DisableShareGateway;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Support\GatewayConfiguration;

/**
 * Locks the installation, the configuration and its unended shares by id; revokes every one of them, then cancels the
 * configuration's waiting opens, requests a close when an endpoint still runs, disables the configuration and audits
 * the change, all in one transaction.
 */
final readonly class DisableShareGatewayHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private SharePolicy $policy,
        private ShareEndings $endings,
    ) {}

    public function handle(DisableShareGateway $command): GatewayConfiguration
    {
        $owner = $this->actors->actor();
        $this->policy->requireManager($owner);
        ShareInstallation::lockForAdmission();
        $configuration = ShareGatewayConfiguration::lockById($command->configurationId);

        $this->endings->revokeAll(Share::lockUnendedOf($configuration->id), ActorIdentity::of($owner));
        ShareGatewayOperation::cancelOpensOf($configuration);

        if (ShareGatewayEndpoint::anyRunningOf($configuration)) {
            ShareGatewayOperation::request($configuration, GatewayOperationType::Close);
        }

        $configuration->disable();
        ShareAudit::recordForInstallation(ShareAuditType::GatewayChanged, ActorIdentity::of($owner), 'disabled');

        return $configuration->toConfiguration();
    }
}
