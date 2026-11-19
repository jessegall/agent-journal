<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\ClaimDriverRequests;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\RequestProgress;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Support\ClaimedRequests;
use App\Agents\Support\PendingWorkSources;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Hands a host its pending requests in turn per runtime. A wake of an idle session with no pending work anywhere is
 * settled as NoWork here and never reaches the host, so no turn starts for nothing.
 */
final readonly class ClaimDriverRequestsHandler implements CommandHandler
{
    public function __construct(private PendingWorkSources $pendingWork) {}

    public function handle(ClaimDriverRequests $command): ClaimedRequests
    {
        /**
         * @var Collection<string, AgentRuntime> $runtimes
         */
        $runtimes = AgentRuntime::query()
            ->with('session.agent')
            ->where('host_id', $command->hostId)
            ->get()
            ->keyBy('id');
        $runtimeIds = $runtimes->keys()->all();
        $control = DriverRequest::query()
            ->whereIn('agent_runtime_id', $runtimeIds)
            ->where('progress', RequestProgress::Accepted)
            ->whereIn('operation', DriverOperation::control())
            ->orderBy('sequence')
            ->lockForUpdate()
            ->readAll('every waiting stop, interrupt and recording of one host is taken before other work')
            ->get();
        $pending = DriverRequest::query()
            ->whereIn('agent_runtime_id', $runtimeIds)
            ->where('progress', RequestProgress::Accepted)
            ->whereNotIn('operation', DriverOperation::control())
            ->orderBy('sequence')
            ->lockForUpdate()
            ->limit($command->limit * max(1, $runtimes->count()))
            ->get()
            ->groupBy('agent_runtime_id');

        $now = CarbonImmutable::now();
        $claimed = [];

        foreach ($control as $request) {
            $request->stage($now);
            $claimed[] = $request->claimed();
        }

        for ($round = 0; count($claimed) < $command->limit && $pending->isNotEmpty(); $round++) {
            foreach ($pending as $runtimeId => $requests) {
                $request = $requests->shift();
                if ($request === null) {
                    $pending->forget($runtimeId);

                    continue;
                }
                if ($this->settledWithoutWork($request, $runtimes->get($runtimeId))) {
                    continue;
                }
                $request->stage($now);
                $claimed[] = $request->claimed();
                if (count($claimed) === $command->limit) {
                    break;
                }
            }
        }

        return new ClaimedRequests($claimed);
    }

    private function settledWithoutWork(DriverRequest $request, AgentRuntime $runtime): bool
    {
        if ($request->operation !== DriverOperation::Wake || $runtime->activity !== RuntimeActivity::Idle) {
            return false;
        }
        if ($this->pendingWork->hasWorkFor(ActorIdentity::of($runtime->session->agent))) {
            return false;
        }

        $request->settleWithoutWork();

        return true;
    }
}
