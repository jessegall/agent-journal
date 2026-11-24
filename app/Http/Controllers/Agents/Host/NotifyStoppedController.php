<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Commands\Drivers\NotifyStopped\NotifyStoppedCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Agents\StartReportRequest;
use App\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host's proof that a claimed start's process exited, or that it made none.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class NotifyStoppedController
{
    public function __invoke(StartReportRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new NotifyStoppedCommand($host->hostId, $request->startKey()));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
