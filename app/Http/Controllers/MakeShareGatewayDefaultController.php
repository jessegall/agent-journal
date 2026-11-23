<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Sharing\GatewayActionRequest;
use App\Models\Sharing\ShareGatewayConfiguration;
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
            new ConfigureShareGatewayCommand(
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
