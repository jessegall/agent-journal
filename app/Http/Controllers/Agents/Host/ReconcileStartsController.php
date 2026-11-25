<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Commands\Agents\ReconcileStarts\ReconcileStartsCommand;
use App\Contracts\Bus\CommandBus;
use App\Http\Requests\Agents\StartReportRequest;
use App\Models\Sessions\SessionProcess;
use App\Values\HostContext;
use Illuminate\Http\JsonResponse;

/**
 * After a restart the host reads its starts that may still have a process, then reports those it proved exited;
 * each it does not name stays unresolved.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class ReconcileStartsController
{
    public function index(HostContext $host): JsonResponse
    {
        return new JsonResponse(['unresolved' => SessionProcess::resolveUnresolvedKeysOf($host->hostId)]);
    }

    public function __invoke(StartReportRequest $request, HostContext $host, CommandBus $commands): JsonResponse
    {
        $accounts = $commands->run(new ReconcileStartsCommand($host->hostId, $request->stoppedStartKeys()));

        return new JsonResponse(['accounts_changed' => $accounts]);
    }
}
