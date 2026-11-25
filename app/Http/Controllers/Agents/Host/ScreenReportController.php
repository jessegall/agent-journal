<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Attributes\Bus\Dispatches;
use App\Commands\Agents\NotifyRuntimeScreen\NotifyRuntimeScreenCommand;
use App\Contracts\Bus\CommandBus;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Takes the host's frame of a watched runtime's screen and answers whether it was stored; the body is weighed before
 * it is read. The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class ScreenReportController
{
    #[Dispatches(NotifyRuntimeScreenCommand::class)]
    public function __invoke(Request $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        return new JsonResponse($commands->run(new NotifyRuntimeScreenCommand($host->hostId, $request->getContent())));
    }
}
