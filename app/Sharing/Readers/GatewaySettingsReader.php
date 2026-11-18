<?php

declare(strict_types=1);

namespace App\Sharing\Readers;

use App\Http\Data\Sharing\GatewayRevisionData;
use App\Http\Data\Sharing\GatewaySettingsData;
use App\Http\Data\Sharing\RootShareData;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayEndpoint;
use App\Sharing\Models\ShareInstallation;
use App\Sharing\Support\ShareGatewayRegistry;
use App\Ui\Contracts\PageReader;

/**
 * The owner's gateway settings: each revision with its readiness asked of its gateway (a read only), its endpoint's
 * health and the shares disabling it would revoke; and Offline when no sharing service holds the gateways.
 */
final readonly class GatewaySettingsReader implements PageReader
{
    public function __construct(private ShareGatewayRegistry $gateways) {}

    public function read(): GatewaySettingsData
    {
        return new GatewaySettingsData(
            $this->gateways->keys(),
            array_map($this->revision(...), ShareGatewayConfiguration::allRevisions()),
            ! ShareInstallation::hasLiveRun(),
        );
    }

    private function revision(ShareGatewayConfiguration $configuration): GatewayRevisionData
    {
        $usable = ! $configuration->isDisabled() && $this->gateways->has($configuration->gateway_key);

        return GatewayRevisionData::fromConfiguration(
            $configuration,
            $usable ? $this->gateways->readinessOf($configuration)->problems : [],
            ShareGatewayEndpoint::newestRunningOf($configuration)->map(fn (ShareGatewayEndpoint $endpoint) => $endpoint->isHealthy())->getOrElse(null),
            array_map(RootShareData::fromShare(...), Share::unendedOf($configuration->id)),
        );
    }
}
