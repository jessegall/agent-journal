<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ReportRuntimeScreen;
use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Takes the host's frame of a watched runtime's screen and answers whether it was stored; the body is weighed before
 * it is read. The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class ScreenReportController
{
    public function __invoke(Request $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        return new JsonResponse($commands->run(new ReportRuntimeScreen($host->hostId, $request->getContent())));
    }
}
