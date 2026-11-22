<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\InterruptAgentRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Interrupts the agent's current turn from Home: the session stays, and the bar shows Interrupting and then what the
 * program does.
 */
final readonly class InterruptAgentController
{
    public function __invoke(
        InterruptAgentRequest $request,
        string $agent,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run($request->command($agent));

        return $redirect->back(303);
    }
}
