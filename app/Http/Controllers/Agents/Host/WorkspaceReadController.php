<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Commands\ReportWorkspaceRead;
use App\Agents\Models\WorkspaceRead;
use App\Agents\Values\HostContext;
use App\Bus\Contracts\CommandBus;
use App\Http\Requests\Agents\WorkspaceReadReportRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * The host reads the workspace reads its actors wait on and answers each with one sample of the checkout.
 * The host's calls run as the journal itself: a host is infrastructure, never an actor.
 */
final readonly class WorkspaceReadController
{
    /**
     * The most pending reads one poll hands the host.
     */
    private const int PENDING_LIMIT = 50;

    public function index(HostContext $host): JsonResponse
    {
        $pending = array_map(
            fn (WorkspaceRead $read) => [
                'reference' => $read->read_reference,
                'actor_id' => $read->actor_id,
                'work' => $read->work,
            ],
            WorkspaceRead::pendingOn($host->hostId, self::PENDING_LIMIT),
        );

        return new JsonResponse(['pending' => $pending]);
    }

    public function __invoke(WorkspaceReadReportRequest $request, HostContext $host, CommandBus $commands): Response
    {
        $commands->run(new ReportWorkspaceRead(
            $host->hostId,
            $request->reference(),
            $request->boolean('available'),
            $request->boolean('dirty'),
            $request->boolean('clean'),
            $request->integer('generation'),
            $request->commit(),
        ));

        return new Response(status: Response::HTTP_NO_CONTENT);
    }
}
