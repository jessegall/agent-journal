<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Commands\RecheckDriverSwitch\RecheckDriverSwitchCommand;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Rechecks a switch whose stop or start the host has not confirmed yet.
 */
final readonly class RecheckDriverSwitchController
{
    /**
     * A page's form returns to that page, which shows the switch again; another caller gets an empty answer.
     */
    #[Dispatches(RecheckDriverSwitchCommand::class)]
    public function __invoke(
        string $switch,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $commands->run(new RecheckDriverSwitchCommand(strtolower($switch)));

        return $redirect->back(303);
    }
}
