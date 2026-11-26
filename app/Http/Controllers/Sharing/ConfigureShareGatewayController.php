<?php

declare(strict_types=1);

namespace App\Http\Controllers\Sharing;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Sharing\ConfigureShareGatewayRequest;
use App\Sharing\Commands\ConfigureShareGateway\ConfigureShareGatewayCommand;
use App\Sharing\Support\Gateways\GatewaySecrets;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Keeps the secrets the owner typed in the credential store, then writes the gateway's next settings revision through
 * the bus with their names only, and returns to the gateway page.
 */
final readonly class ConfigureShareGatewayController
{
    #[Dispatches(ConfigureShareGatewayCommand::class)]
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
