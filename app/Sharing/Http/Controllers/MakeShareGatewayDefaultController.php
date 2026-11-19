<?php

declare(strict_types=1);

namespace App\Sharing\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Sharing\GatewayActionRequest;
use App\Sharing\Commands\ConfigureShareGateway;
use App\Sharing\Models\ShareGatewayConfiguration;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Makes a gateway the default by writing its next revision with the same settings as the one the owner picked, once
 * the gateway is ready; earlier shares keep the revisions they pinned.
 */
final readonly class MakeShareGatewayDefaultController
{
    public function __invoke(
        GatewayActionRequest $request,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $settings = ShareGatewayConfiguration::usable($request->configurationId())->settings;
        $commands->run(
            new ConfigureShareGateway(
                $settings->gatewayKey,
                $settings->executableVersion,
                $settings->providerHost,
                $settings->publicOrigin,
                $settings->listenerPort,
                $settings->secretReferences,
                true,
                $request->requestKey(),
            ),
        );

        return $redirect->back(303);
    }
}
