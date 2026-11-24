<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Commands\NotifyRunning\NotifyRunningCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Agents\StartReportRequest;
use App\Values\HostContext;
use Illuminate\Http\Response;

/**
 * Takes the host's report that it made a claimed start's process, with its execution identity.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class NotifyRunningController
{
    public function __invoke(StartReportRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new NotifyRunningCommand($host->hostId, $request->startKey(), $request->executionId()));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
