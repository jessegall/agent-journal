<?php

declare(strict_types=1);

namespace App\Sharing\Handlers;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Sharing\Commands\ConfigureShareGateway;
use App\Sharing\Contracts\SharePolicy;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Exceptions\GatewayNotReady;
use App\Sharing\Exceptions\GatewaySecretRefused;
use App\Sharing\Gateways\Support\GatewaySecrets;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Support\GatewayConfiguration;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\ShareGatewayRegistry;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Checks the owner, the registered gateway and that every named secret is stored, then under the installation lock
 * writes the gateway's next settings revision and audits the change. Making it the default asks the gateway whether
 * it is ready, a read only, and refuses when it is not.
 */
final readonly class ConfigureShareGatewayHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private SharePolicy $policy,
        private ShareGatewayRegistry $gateways,
        private GatewaySecrets $secrets,
        private Dispatcher $events,
    ) {}

    public function handle(ConfigureShareGateway $command): GatewayConfiguration
    {
        $owner = $this->actors->actor();
        $this->policy->requireManager($owner);
        $gateway = $this->gateways->get($command->gatewayKey);

        foreach ($command->secretReferences as $reference) {
            if (! $this->secrets->has($reference)) {
                throw GatewaySecretRefused::missing($reference);
            }
        }

        $settings = new GatewaySettings($command->gatewayKey, $command->executableVersion, $command->providerHost, $command->publicOrigin, $command->listenerPort, $command->secretReferences);
        ShareInstallation::lockForAdmission();
        $configuration = ShareGatewayConfiguration::revise($settings);

        if ($command->makeDefault) {
            $readiness = $gateway->readiness($configuration->toConfiguration());

            if (! $readiness->isReady()) {
                throw GatewayNotReady::forDefault($command->gatewayKey, $readiness->problems);
            }

            $configuration->makeDefault();
        }

        ShareAudit::recordForInstallation(ShareAuditType::GatewayChanged, ActorIdentity::of($owner), 'configured');
        $this->events->dispatch($configuration->changeFact());

        return $configuration->toConfiguration();
    }
}
