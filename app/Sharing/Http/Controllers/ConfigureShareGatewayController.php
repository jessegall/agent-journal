<?php

declare(strict_types=1);

namespace App\Sharing\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Sharing\ConfigureShareGatewayRequest;
use App\Sharing\Gateways\Support\GatewaySecrets;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Keeps the secrets the owner typed in the credential store, then writes the gateway's next settings revision through
 * the bus with their names only, and returns to the gateway page.
 */
final readonly class ConfigureShareGatewayController
{
    public function __invoke(
        ConfigureShareGatewayRequest $request,
        GatewaySecrets $secrets,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $request->storeTypedSecrets($secrets);
        $commands->run($request->command());

        return $redirect->back(303);
    }
}
