<?php

declare(strict_types=1);

namespace App\Sharing\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Sharing\GatewayActionRequest;
use App\Sharing\Commands\DisableShareGateway;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Disables a gateway revision through the bus, which revokes the shares it serves first, and returns to the gateway
 * page.
 */
final readonly class DisableShareGatewayController
{
    public function __invoke(GatewayActionRequest $request, CommandBus $commands, Redirector $redirect): RedirectResponse
    {
        $commands->run(new DisableShareGateway($request->configurationId(), $request->requestKey()));

        return $redirect->back(303);
    }
}
