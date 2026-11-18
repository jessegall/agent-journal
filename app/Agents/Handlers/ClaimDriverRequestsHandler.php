<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ClaimDriverRequests;
use App\Agents\Enums\RequestProgress;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Support\ClaimedRequests;
use App\Contracts\CommandHandler;

final readonly class ClaimDriverRequestsHandler implements CommandHandler
{
    public function handle(ClaimDriverRequests $command): ClaimedRequests
    {
        $runtimeIds = AgentRuntime::query()->where('host_id', $command->hostId)->pluck('id')->all();
        $pending = DriverRequest::query()
            ->whereIn('agent_runtime_id', $runtimeIds)
            ->where('progress', RequestProgress::Accepted)
            ->orderBy('sequence')
            ->lockForUpdate()
            ->limit($command->limit * max(1, count($runtimeIds)))
            ->get()
            ->groupBy('agent_runtime_id');

        $claimed = [];
        for ($round = 0; count($claimed) < $command->limit && $pending->isNotEmpty(); $round++) {
            foreach ($pending as $runtimeId => $requests) {
                $request = $requests->shift();
                if ($request === null) {
                    $pending->forget($runtimeId);

                    continue;
                }
                $request->stage();
                $claimed[] = $request->claimed();
                if (count($claimed) === $command->limit) {
                    break;
                }
            }
        }

        return new ClaimedRequests($claimed);
    }
}
