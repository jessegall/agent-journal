<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Commands\RetryDriverSwitch\RetryDriverSwitchCommand;
use App\Contracts\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Redirector;

/**
 * Retries the launch of a switch that failed, with its own request and target.
 */
final readonly class RetryDriverSwitchController
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
        $commands->run(new RetryDriverSwitchCommand(strtolower($switch)));

        return $request->expectsJson() ? new Response(status: Response::HTTP_NO_CONTENT) : $redirect->back(303);
    }
}
