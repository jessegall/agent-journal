<?php

declare(strict_types=1);

namespace App\Agents\Commands\ClaimDriverRequests;

use App\Actors\Support\ActorIdentity;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\RequestProgress;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\Host;
use App\Agents\Models\ProcessStart;
use App\Agents\Models\StartRecord;
use App\Agents\Support\ClaimedRequests;
use App\Agents\Support\PendingWorkSources;
use App\Agents\Support\PresentationPrompts;
use App\Agents\Support\PrivateValues;
use App\Agents\Values\ClaimedRequest;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;

/**
 * Hands a host its pending requests in turn per runtime; a session's stop waits until its helpers are proven stopped.
 * A wake of an idle session with no pending work anywhere is settled as NoWork here and never reaches the host, so no
 * turn starts for nothing.
 */
final readonly class ClaimDriverRequestsHandler implements CommandHandler
{
    public function __construct(
        private PendingWorkSources $pendingWork,
        private PresentationPrompts $presentation,
        private PrivateValues $privateValues,
    ) {}

    public function handle(ClaimDriverRequestsCommand $command): ClaimedRequests
    {
        Host::query()->whereKey($command->hostId)->sole()->advertiseBrowserInput($command->browserInput);

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

        $held = StartRecord::sessionsHoldingDeliveries(array_values(array_map(
            fn (AgentRuntime $runtime) => $runtime->agent_session_id,
            $runtimes->all(),
        )));

        $bootstrapped = [];

        $starts = ProcessStart::latestIdsOfSessions(array_values(array_map(
            fn (AgentRuntime $runtime) => $runtime->agent_session_id,
            $runtimes->all(),
        )));

        $waitingOnHelpers = AgentRuntime::sessionsWaitingOnHelpers(array_values(array_map(
            fn (AgentRuntime $runtime) => $runtime->agent_session_id,
            $runtimes->all(),
        )));

        foreach ($control as $request) {
            $runtime = $runtimes->get($request->agent_runtime_id);

            if ($this->isStopWaitingOnHelpers($request, $runtime, $waitingOnHelpers)) {
                continue;
            }

            $request->stage($now);

            $claimed[] = $this->privateValues->carriedBy(
                $request,
                $request->claimed($runtime, $starts[$runtime->agent_session_id] ?? null),
            );
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

                $runtime = $runtimes->get($runtimeId);
                $sessionId = $runtime->agent_session_id;

                // Until a start's driver proves its conversation, only its bootstrap goes out; the rest waits.
                if (in_array($sessionId, $held, true)) {
                    if (! $request->isInitialWakeOf($sessionId)) {
                        continue;
                    }

                    $bootstrapped[] = $sessionId;
                }

                $request->stage($now);
                $claim = $request->claimed($runtime, $starts[$runtime->agent_session_id] ?? null);
                $claimed[] = $this->withPresentation($request, $runtime, $claim, $now);

                if (count($claimed) === $command->limit) {
                    break;
                }
            }
        }

        if ($bootstrapped !== []) {
            StartRecord::lockedAcceptedOf($bootstrapped)->each(fn (StartRecord $record) => $record->prepareIdentity());
        }

        return new ClaimedRequests($claimed);
    }

    /**
     * A stop of a session whose helpers are not all proven stopped stays waiting, so the helpers end first.
     *
     * @param  list<string>  $waiting
     */
    private function isStopWaitingOnHelpers(DriverRequest $request, AgentRuntime $runtime, array $waiting): bool
    {
        return $request->operation === DriverOperation::Stop
            && in_array($runtime->agent_session_id, $waiting, true);
    }

    /**
     * A wake carries the next batch of chat text for the runtime's driver when one waits; otherwise it keeps the
     * generic pending-work prompt, so desk work is never starved by a chat backlog.
     */
    private function withPresentation(
        DriverRequest $request,
        AgentRuntime $runtime,
        ClaimedRequest $claim,
        CarbonImmutable $now,
    ): ClaimedRequest {
        if ($request->operation !== DriverOperation::Wake) {
            return $claim;
        }

        $prompt = $this->presentation->promptFor($runtime, $now);

        return $prompt === null ? $claim : $claim->withMessage($prompt);
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
