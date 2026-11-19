<?php

declare(strict_types=1);

namespace App\Http\Controllers\Agents\Host;

use App\Agents\Models\ProcessStart;
use App\Agents\Models\SessionOutputGrant;
use App\Agents\Support\HostContext;
use App\Agents\Support\SessionOutputPaths;
use App\Hooks\Relay\OutputGrantSeal;
use App\Http\Requests\Agents\StartReportRequest;
use Illuminate\Http\JsonResponse;

/**
 * Hands the host that claimed a start the start's current output grants, sealed for its start key and mapping
 * generation, for the relay to read its own history while the journal is away. No path the host sends grants
 * anything; another host's start is unknown.
 */
final readonly class OutputGrantController
{
    public function __invoke(StartReportRequest $request, HostContext $host, OutputGrantSeal $seal): JsonResponse
    {
        $startKey = $request->startKey();
        $start = ProcessStart::claimedBy($host->hostId, $startKey);
        $paths = array_map(
            fn (SessionOutputPaths $paths) => $paths->transcriptPath,
            SessionOutputGrant::currentOf($start),
        );

        return new JsonResponse([
            'start_key' => $startKey,
            'generation' => $start->output_generation,
            'paths' => $paths,
            'seal' => $seal->seal($startKey, $start->output_generation, $paths),
        ]);
    }
}
