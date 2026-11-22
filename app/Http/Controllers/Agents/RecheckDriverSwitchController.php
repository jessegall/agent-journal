<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Commands\RecheckDriverSwitch\RecheckDriverSwitchCommand;
use App\Contracts\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;

/**
 * Rechecks a switch whose stop or start the host has not confirmed yet.
 */
final readonly class RecheckDriverSwitchController
{
    /**
     * A page's form returns to that page, which shows the switch again; another caller gets an empty answer.
     */
    public function __invoke(
        string $switch,
        Request $request,
        CommandBus $commands,
        Redirector $redirect,
    ): Response|RedirectResponse {
        $commands->run(new RecheckDriverSwitchCommand(strtolower($switch)));

        return $request->expectsJson() ? new Response(status: Response::HTTP_NO_CONTENT) : $redirect->back(303);
    }
}
