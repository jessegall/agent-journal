<?php

declare(strict_types=1);

namespace App\Commands\Sharing\ConfigureShareGateway;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Sharing\SharePolicy;
use App\Enums\Sharing\ShareAuditType;
use App\Exceptions\GatewayNotSetUp;
use App\Exceptions\GatewaySecretRefused;
use App\Exceptions\UnknownShareGateway;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareInstallation;
use App\Support\ActorIdentity;
use App\Support\GatewayConfiguration;
use App\Support\Gateways\Support\GatewaySecrets;
use App\Support\GatewaySettings;
use App\Support\ShareGatewayRegistry;

/**
 * Checks the owner, the registered gateway and that every named secret is stored, then under the installation lock
 * writes the gateway's next settings revision and audits the change. Making it the default asks the gateway whether
 * it is ready, a read only, and refuses when it is not.
 */
final readonly class ConfigureShareGatewayHandler implements CommandHandler
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

        ShareAudit::create(null, ShareAuditType::GatewayChanged, ActorIdentity::of($owner), 'configured');

        return $configuration->toConfiguration;
    }
}
