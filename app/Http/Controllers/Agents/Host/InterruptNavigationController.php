<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Attributes\Bus\Dispatches;
use App\Commands\Navigation\InterruptNavigation\InterruptNavigationCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host's report that the user took over a runtime whose navigation request was open. The host's calls
 * run as the journal itself, never an actor.
 */
final readonly class InterruptNavigationController
{
    #[Dispatches(InterruptNavigationCommand::class)]
    public function __invoke(string $navigation, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new InterruptNavigationCommand($host->hostId, $navigation));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
