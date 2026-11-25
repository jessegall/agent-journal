<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Attributes\Bus\Dispatches;
use App\Commands\Drivers\RetryDriverSwitch\RetryDriverSwitchCommand;
use App\Contracts\Bus\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Retries the start of a switch that failed, with its own request and target.
 */
final readonly class RetryDriverSwitchController
{
    /**
     * A page's form returns to that page, which shows the switch again; another caller gets an empty answer.
     */
    #[Dispatches(RetryDriverSwitchCommand::class)]
    public function __invoke(
        string $switch,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new RetryDriverSwitchCommand(strtolower($switch)));

        return $redirect->back(303);
    }
}
