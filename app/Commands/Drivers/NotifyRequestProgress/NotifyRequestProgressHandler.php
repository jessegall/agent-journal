<?php

declare(strict_types=1);

namespace App\Commands\Drivers\NotifyRequestProgress;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\DriverOperation;
use App\Enums\HoldReason;
use App\Enums\RequestOutcome;
use App\Enums\RequestProgress;
use App\Enums\RuntimeEventType;
use App\Events\Sessions\SessionStateChanged;
use App\Exceptions\HostReportRefused;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RuntimeEvent;
use App\Models\Starts\StartRecord;
use App\Support\HostRuntimes;
use App\Support\InitialWakeSettlement;
use App\Support\NavigationRoundReports;
use App\Support\StartIdentity;
use App\Support\TerminalGrantReports;
use Carbon\CarbonImmutable;

final readonly class NotifyRequestProgressHandler implements CommandHandler
{
    /**
     * How long a request its host could not start yet waits before it is offered again, such as a prompt the screen
     * did not let in while the driver comes up.
     */
    private const int OFFER_AGAIN_WAIT_MS = 2_000;

    public function __construct(
        private HostRuntimes $runtimes,
        private NavigationRoundReports $navigationReports,
        private InitialWakeSettlement $initialWakes,
        private TerminalGrantReports $terminalGrants,
        private StartIdentity $startIdentity,
        private CommandFacts $facts,
    ) {}

    public function handle(NotifyRequestProgressCommand $command): void
    {
        $request = DriverRequest::lockedById($command->requestId);
        $runtime = $this->runtimes->lockedFor($command->hostId, $request->agent_runtime_id);

        if ($command->attempt < $request->attempt_version) {
            throw HostReportRefused::staleAttempt($request->id, $command->attempt, $request->attempt_version);
        }

        if ($command->sequence !== null && $command->binding !== null && RuntimeEvent::record(
            $runtime,
            $command->binding->processGeneration,
            $command->sequence,
            RuntimeEventType::RequestProgress,
            $request->id,
        )->isReplay) {
            return;
        }

        $this->observeModel($command, $request, $runtime);

        $outcome = $command->outcomeOf($request);

        match ($command->progressOf($request)) {
            RequestProgress::Applying => $request->beginApplying($command->attempt),
            RequestProgress::Applied => $request->markApplied((string) $command->actualBinding, $outcome),
            RequestProgress::DeliveryUncertain => $request->markUncertain(),
            RequestProgress::Failed => $request->fail($outcome ?? RequestOutcome::Refused),
            RequestProgress::Unavailable => $request->markUnavailable($outcome ?? RequestOutcome::Refused),
            RequestProgress::Staged => $this->answerStaged($request),
            RequestProgress::Accepted,
            RequestProgress::Cancelled => $request->cancel(),
            RequestProgress::Superseded => $request->hold(
                $request->hold_reason,
            ),
        };

        if ($this->needsAttention($command, $request)) {
            $runtime->holdFor(HoldReason::NeedsAttention);
        }

        if ($request->operation->isTerminalControl()) {
            $this->terminalGrants->settle($request, $command);
        }

        if ($command->refusal !== null) {
            $request->recordRefusal($command->refusal, $command->hasCreatedNoProcess);
        }

        if ($command->script !== null) {
            $request->recordScriptProgress($command->script);
        }

        if ($command->navigation !== null) {
            $this->navigationReports->apply($request, $command->navigation);
        }

        // Only the request that starts the session's process, proved never to have made one, settles its launch; any
        // other refused request keeps its own failure and leaves the session as it is.
        if ($request->canRetry()) {
            $this->initialWakes->settle($request, $runtime, $command);
        }

        // A host that could not send its ready report again leaves an unverified start without proof: it stays held,
        // uncertain. A start already verified keeps its proof; the answer only showed the host is there.
        if ($request->operation === DriverOperation::ResendReadiness && $request->progress->isRefused()) {
            StartRecord::lockedLatestOf($runtime->agent_session_id)
                ->filter(fn (StartRecord $start) => $start->readiness->isUnverified())
                ->forAll(fn (StartRecord $start) => $start->markReadinessUnseen());
        }

        if ($request->isInitialWakeOf($runtime->agent_session_id)) {
            $this->startIdentity->settle($runtime, $command);
        }

        $this->facts->publishAfterCommit(new SessionStateChanged($runtime->agent_session_id));
    }

    /**
     * The model a turn's own output named is what the runtime runs on now; the turn's own request records it once.
     */
    private function observeModel(
        NotifyRequestProgressCommand $command,
        DriverRequest $request,
        AgentRuntime $runtime,
    ): void {
        if ($command->turnEnd?->model === null || $request->changesASetting()) {
            return;
        }

        $runtime->observeSettings($command->turnEnd->model, null, CarbonImmutable::now());
    }

    /**
     * A setting change staged by the host waits for the next turn, which settles it; any other staged request is one
     * the host could not start, so it is given back to be offered again after a wait.
     */
    private function answerStaged(DriverRequest $request): void
    {
        if ($request->changesASetting()) {
            return;
        }

        $request->giveBack(CarbonImmutable::now()->addMilliseconds(self::OFFER_AGAIN_WAIT_MS));
    }

    /**
     * The journal's hold from the host's plain facts: a runtime needs someone to look at it when its account is not
     * signed in or its start names no conversation, when a stop could not be proven, or when a key script ended in no
     * outcome the journal knows.
     */
    private function needsAttention(NotifyRequestProgressCommand $command, DriverRequest $request): bool
    {
        $failed = $request->progress === RequestProgress::Failed;

        return $command->refusal?->needsAttention() === true
            || ($failed && $request->operation === DriverOperation::Stop)
            || ($failed && $request->operation === DriverOperation::KeyScript && $command->outcome === null);
    }
}
