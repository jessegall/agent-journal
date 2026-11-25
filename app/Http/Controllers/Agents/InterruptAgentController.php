<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Attributes\Bus\Dispatches;
use App\Commands\Agents\InterruptAgent\InterruptAgentCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Agents\InterruptAgentRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Interrupts the agent's current turn from Home: the session stays, and the bar shows Interrupting and then what the
 * driver does.
 */
final readonly class InterruptAgentController
{
    #[Dispatches(InterruptAgentCommand::class)]
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
