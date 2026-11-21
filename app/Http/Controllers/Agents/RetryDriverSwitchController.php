<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents;

use App\Agents\Commands\RetryDriverSwitch;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\Response;

/**
 * Retries the launch of a switch that failed, with its own request and target.
 */
final readonly class RetryDriverSwitchController
{
    public function __invoke(string $switch, CommandBus $commands): Response
    {
        $commands->run(new RetryDriverSwitch(strtolower($switch)));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
