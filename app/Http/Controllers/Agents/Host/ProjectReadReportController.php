<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Agents\ProjectReadReportRequest;
use App\Values\HostContext;
use Symfony\Component\HttpFoundation\Response;

/**
 * A host answers a read of its project that a claim handed it.
 */
final readonly class ProjectReadReportController
{
    public function __invoke(ProjectReadReportRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run($request->command($host->hostId));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
