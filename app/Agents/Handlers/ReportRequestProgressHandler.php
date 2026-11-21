<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Actions\StartHeartbeats;
use App\Agents\Commands\ReportRequestProgress;
use App\Agents\Enums\DriverOperation;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Models\AgentRuntime;
use App\Agents\Models\AgentSession;
use App\Agents\Models\DriverRequest;
use App\Agents\Models\ProcessStart;
use App\Agents\Support\HostRuntimes;
use App\Agents\Support\NavigationRoundReports;
use App\Contracts\CommandHandler;

final readonly class ReportRequestProgressHandler implements CommandHandler
{
    public function __construct(
        private HostRuntimes $runtimes,
        private NavigationRoundReports $navigationReports,
        private StartHeartbeats $heartbeats,
    ) {}

    public function handle(ReportRequestProgress $command): void
    {
        $request = DriverRequest::query()->whereKey($command->requestId)->lockForUpdate()->firstOrFail();
        $runtime = $this->runtimes->lockedFor($command->hostId, $request->agent_runtime_id);

        if ($command->attempt < $request->attempt_version) {
            throw HostReportRefused::staleAttempt($request->id, $command->attempt, $request->attempt_version);
        }

        match ($command->progress) {
            RequestProgress::Applying => $request->beginApplying($command->attempt),
            RequestProgress::Applied => $request->markApplied((string) $command->actualBinding, $command->outcome),
            RequestProgress::DeliveryUncertain => $request->markUncertain(),
            RequestProgress::Failed => $request->fail($command->outcome ?? RequestOutcome::Refused),
            RequestProgress::Unavailable => $request->markUnavailable($command->outcome ?? RequestOutcome::Refused),
            RequestProgress::Accepted,
            RequestProgress::Staged,
            RequestProgress::Superseded,
            RequestProgress::Cancelled => $request->hold(
                $request->hold_reason,
            ),
        };

        if ($command->script !== null) {
            $request->recordScriptProgress($command->script);
        }

        if ($command->navigation !== null) {
            $this->navigationReports->apply($request, $command->navigation);
        }

        // A wake that failed or was unavailable wrote nothing, which is the request's own word for may-retry.
        if ($request->operation === DriverOperation::Wake && $request->canRetry()) {
            $this->endRefusedWake($runtime, ($command->outcome ?? RequestOutcome::Refused)->value);
        }
    }

    /**
     * A wake the host refused, such as a session container it could not create, ends the start, its session and
     * runtime the way a proven exit ends them, so the agent can start again.
     */
    private function endRefusedWake(AgentRuntime $runtime, string $evidence): void
    {
        $session = AgentSession::query()->findOrFail($runtime->agent_session_id);
        $start = ProcessStart::latestOfSession($session->id);

        if ($start === null) {
            return;
        }

        $this->heartbeats->endStart($start, $session, "the host could not wake it ({$evidence})");
    }
}
