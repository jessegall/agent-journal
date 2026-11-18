<?php

declare(strict_types=1);

namespace App\Sharing\Readers;

use App\Http\Data\Sharing\GatewayRevisionData;
use App\Http\Data\Sharing\GatewaySettingsData;
use App\Sharing\Models\ShareGatewayConfiguration;
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
        return GatewaySettingsData::from([
            'gatewayKeys' => $this->gateways->keys(),
            'revisions' => array_map(
                fn (ShareGatewayConfiguration $configuration) => GatewayRevisionData::fromConfiguration(
                    $configuration,
                    $this->gateways,
                ),
                ShareGatewayConfiguration::allRevisions(),
            ),
            'isOffline' => ! ShareInstallation::hasLiveRun(),
        ]);
    }
}
