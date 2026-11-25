<?php

declare(strict_types=1);

namespace App\Commands\Drivers\ClaimDriverRequests;

use App\Contracts\Actors\AgentTexts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\DriverOperation;
use App\Enums\RequestProgress;
use App\Enums\RuntimeActivity;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Projects\Host;
use App\Models\Starts\ProcessStart;
use App\Models\Starts\StartRecord;
use App\Support\ActorIdentity;
use App\Support\ClaimedRequests;
use App\Support\PendingWorkSources;
use App\Support\PrivateValues;
use App\Values\AgentText;
use App\Values\ClaimedRequest;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
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
        private AgentTexts $texts,
        private PrivateValues $privateValues,
    ) {}

    public function handle(ClaimDriverRequestsCommand $command): ClaimedRequests
    {
        Host::query()->whereKey($command->hostId)->sole()->advertiseBrowserInput($command->browserInput);

        /**
         * @var Collection<string, AgentRuntime> $runtimes
         */
        // Only the runtimes with a request waiting: a host keeps the runtime of every session it ever ran.
        $runtimes = AgentRuntime::query()
            ->with('session.agent')
            ->onHost($command->hostId)
            ->whereHas('requests', fn (Builder $requests) => $requests->where('progress', RequestProgress::Accepted))
            ->readAll('every runtime of one host with a request waiting is offered its work')
            ->get()
            ->keyBy('id');

        $runtimeIds = $runtimes->keys()->all();

        $control = DriverRequest::query()
            ->ofAgentRuntimes($runtimeIds)
            ->withProgress(RequestProgress::Accepted)
            ->withAnyOperation(DriverOperation::control())
            ->bySequence()
            ->lockForUpdate()
            ->readAll('every waiting stop, interrupt and recording of one host is taken before other work')
            ->get();

        $pending = DriverRequest::query()
            ->ofAgentRuntimes($runtimeIds)
            ->withProgress(RequestProgress::Accepted)
            ->offerable(CarbonImmutable::now())
            ->whereNotIn('operation', DriverOperation::control())
            ->bySequence()
            ->lockForUpdate()
            ->readUpTo($command->limit * max(1, $runtimes->count()))
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
                $request->claimed($runtime, $starts[$runtime->agent_session_id] ?? null, false),
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

                // A runtime the journal holds, interrupted or needing attention, gets no work until its hold is
                // released; the host keeps no hold of its own.
                if ($request->operation->startsWork() && $runtimes->get($runtimeId)->isHeldFromWork()) {
                    continue;
                }

                $runtime = $runtimes->get($runtimeId);
                $sessionId = $runtime->agent_session_id;

                // Until a start's driver proves its conversation, only its bootstrap goes out; the rest waits.
                $isBootstrap = in_array($sessionId, $held, true);

                if ($isBootstrap) {
                    if (! $request->isInitialWakeOf($sessionId)) {
                        continue;
                    }

                    $bootstrapped[] = $sessionId;
                }

                $request->stage($now);
                $claim = $request->claimed($runtime, $starts[$runtime->agent_session_id] ?? null, $isBootstrap);
                $claimed[] = $this->withWakePrompt($request, $claim);

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
     * A wake carries the pending-work prompt; the agent's states say what waits, such as an unread message.
     */
    private function withWakePrompt(DriverRequest $request, ClaimedRequest $claim): ClaimedRequest
    {
        if ($request->operation !== DriverOperation::Wake) {
            return $claim;
        }

        return $claim->withMessage($this->texts->render(AgentText::of('core.drivers.pending_work')));
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
