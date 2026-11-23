<?php

declare(strict_types=1);

namespace App\Commands\ReportRequestProgress;

use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Enums\DriverOperation;
use App\Enums\RequestOutcome;
use App\Enums\RequestProgress;
use App\Enums\RuntimeEventType;
use App\Events\SessionStateChanged;
use App\Exceptions\HostReportRefused;
use App\Models\Drivers\DriverRequest;
use App\Models\Drivers\RuntimeEvent;
use App\Models\Starts\StartRecord;
use App\Support\HostRuntimes;
use App\Support\InitialWakeSettlement;
use App\Support\NavigationRoundReports;
use App\Support\StartIdentity;
use App\Support\TerminalGrantReports;

final readonly class ReportRequestProgressHandler implements CommandHandler
{
    public function __construct(
        private HostRuntimes $runtimes,
        private NavigationRoundReports $navigationReports,
        private InitialWakeSettlement $initialWakes,
        private TerminalGrantReports $terminalGrants,
        private StartIdentity $startIdentity,
        private CommandFacts $facts,
    ) {}

    public function handle(ReportRequestProgressCommand $command): void
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

        match ($command->progress) {
            RequestProgress::Applying => $request->beginApplying($command->attempt),
            RequestProgress::Applied => $request->markApplied((string) $command->actualBinding, $command->outcome),
            RequestProgress::DeliveryUncertain => $request->markUncertain(),
            RequestProgress::Failed => $request->fail($command->outcome ?? RequestOutcome::Refused),
            RequestProgress::Unavailable => $request->markUnavailable($command->outcome ?? RequestOutcome::Refused),
            RequestProgress::Accepted,
            RequestProgress::Staged,
            RequestProgress::Cancelled => $request->cancel(),
            RequestProgress::Superseded => $request->hold(
                $request->hold_reason,
            ),
        };

        if ($request->operation->isTerminalControl()) {
            $this->terminalGrants->settle($request, $command);
        }

        if ($command->refusal !== null) {
            $request->recordRefusal($command->refusal, $command->noProcessCreated);
        }

        if ($command->script !== null) {
            $request->recordScriptProgress($command->script);
        }

        if ($command->navigation !== null) {
            $this->navigationReports->apply($request, $command->navigation);
        }

        // Only the start's initial wake, proved never to have made a process, settles its launch; any other refused wake
        // keeps its own failure and leaves the session as it is.
        if ($request->operation === DriverOperation::Wake && $request->canRetry()) {
            $this->initialWakes->settle($request, $runtime, $command);
        }

        // A host that could not send its ready report again leaves the start without proof: it stays held, uncertain.
        if ($request->operation === DriverOperation::ResendReadiness && $request->progress->isRefused()) {
            StartRecord::lockedLatestOf($runtime->agent_session_id)->forAll(
                fn (StartRecord $start) => $start->markReadinessUnseen(),
            );
        }

        if ($request->isInitialWakeOf($runtime->agent_session_id)) {
            $this->startIdentity->settle($runtime, $command);
        }

        $this->facts->publishAfterCommit(new SessionStateChanged($runtime->agent_session_id));
    }
}
