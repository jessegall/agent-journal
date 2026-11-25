<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\ConfigureShareGateway;

use App\Contracts\Sharing\SharePolicy;
use App\Support\ActorReference;
use App\Support\GatewayConfiguration;
use App\Support\GatewaySettings;
use Domain\Sharing\Commands\Support\SharingCommandHandler;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Exceptions\GatewayNotSetUp;
use Domain\Sharing\Exceptions\GatewaySecretRefused;
use Domain\Sharing\Exceptions\UnknownShareGateway;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareInstallation;
use Domain\Sharing\Support\Gateways\GatewaySecrets;
use Domain\Sharing\Support\ShareGatewayRegistry;

/**
 * Checks the owner, the registered gateway and that every named secret is stored, then under the installation lock
 * writes the gateway's next settings revision and audits the change. Making it the default asks the gateway whether
 * it is ready, a read only, and refuses when it is not.
 */
final readonly class ConfigureShareGatewayHandler extends SharingCommandHandler
{
    public function __construct(
        private SharePolicy $policy,
        private ShareGatewayRegistry $gateways,
        private GatewaySecrets $secrets,
    ) {}

    public function handle(ConfigureShareGatewayCommand $command): GatewayConfiguration
    {
        $owner = $command->dispatchedBy();
        $this->policy->assertManager($owner);

        if (! $this->gateways->has($command->gatewayKey)) {
            throw UnknownShareGateway::forKey($command->gatewayKey);
        }

        foreach ($command->secretReferences as $reference) {
            if (! $this->secrets->has($reference)) {
                throw GatewaySecretRefused::missing($reference);
            }
        }

        $settings = new GatewaySettings(
            $command->gatewayKey,
            $command->executableVersion,
            $command->providerHost,
            $command->publicOrigin,
            $command->listenerPort,
            $command->secretReferences,
        );

        ShareInstallation::create();
        $configuration = ShareGatewayConfiguration::create($settings);

        if ($command->makesDefault) {
            $setupCheck = $this->gateways->setupCheckOf($configuration);

            if (! $setupCheck->isComplete()) {
                throw GatewayNotSetUp::forDefault($command->gatewayKey, $setupCheck->problems);
            }

            ShareGatewayConfiguration::query()->markedDefault()->whereKeyNot(
                $configuration->id,
            )->lockForUpdate()->readAll('at most one configuration is the default')->get();

            ShareGatewayConfiguration::query()->markedDefault()->whereKeyNot($configuration->id)->update(
                ['is_default' => false],
            );

            $configuration->makeDefault();
        }

        ShareAudit::create(null, ShareAuditType::GatewayChanged, ActorReference::of($owner), 'configured');

        return $configuration->toConfiguration;
    }
}
