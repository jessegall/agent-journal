<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Commands\RecheckDriverSwitch;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\Response;

/**
 * Rechecks a switch whose stop or start the host has not confirmed yet.
 */
final readonly class RecheckDriverSwitchController
{
    public function __invoke(string $switch, CommandBus $commands): Response
    {
        $commands->run(new RecheckDriverSwitch(strtolower($switch)));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
