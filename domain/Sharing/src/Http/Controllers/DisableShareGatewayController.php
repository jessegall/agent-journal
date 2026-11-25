<?php

declare(strict_types=1);

namespace Domain\Sharing\Http\Controllers;

use Domain\Sharing\Commands\DisableShareGateway\DisableShareGatewayCommand;
use App\Contracts\Bus\CommandBus;
use Domain\Sharing\Http\Requests\GatewayActionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Disables a gateway revision through the bus, which revokes the shares it serves first, and returns to the gateway
 * page.
 */
final readonly class DisableShareGatewayController
{
    public function __invoke(
        GatewayActionRequest $request,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new DisableShareGatewayCommand($request->configurationId(), $request->requestKey()));

        return $redirect->back(303);
    }
}
