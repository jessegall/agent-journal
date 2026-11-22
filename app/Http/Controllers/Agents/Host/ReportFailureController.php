<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ReportFailure;
use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\StartReportRequest;
use Illuminate\Http\Response;

/**
 * Takes the host's report that a claimed start's driver failed, after it proved the process gone.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class ReportFailureController
{
    public function __invoke(StartReportRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new ReportFailure($host->hostId, $request->startKey(), $request->failure()));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
