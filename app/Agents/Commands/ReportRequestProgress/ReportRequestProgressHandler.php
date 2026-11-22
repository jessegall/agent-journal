<?php

declare(strict_types=1);

namespace App\Agents\Commands\ReportRequestProgress;

use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Enums\RuntimeEventType;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\RuntimeEvent;
use App\Agents\Support\HostRuntimes;
use App\Agents\Support\InitialWakeSettlement;
use App\Agents\Support\NavigationRoundReports;
use App\Agents\Support\StartIdentity;
use App\Agents\Support\TerminalGrantReports;
use App\Contracts\CommandHandler;

final readonly class ReportRequestProgressHandler implements CommandHandler
{
    public function __construct(
        private HostRuntimes $runtimes,
        private NavigationRoundReports $navigationReports,
        private InitialWakeSettlement $initialWakes,
        private TerminalGrantReports $terminalGrants,
        private StartIdentity $startIdentity,
    ) {}

    public function handle(ReportRequestProgressCommand $command): void
    {
        $request = DriverRequest::query()->whereKey($command->requestId)->lockForUpdate()->firstOrFail();
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

        if ($request->isInitialWakeOf($runtime->agent_session_id)) {
            $this->startIdentity->settle($runtime, $command);
        }
    }
}
