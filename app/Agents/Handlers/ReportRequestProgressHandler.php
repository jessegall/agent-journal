<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReportRequestProgress;
use App\Agents\Enums\RequestOutcome;
use App\Agents\Enums\RequestProgress;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Models\DriverRequest;
use App\Agents\Support\HostRuntimes;
use App\Contracts\CommandHandler;

final readonly class ReportRequestProgressHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes) {}

    public function handle(ReportRequestProgress $command): void
    {
        $request = DriverRequest::query()->whereKey($command->requestId)->lockForUpdate()->firstOrFail();
        $this->runtimes->lockedFor($command->hostId, $request->agent_runtime_id);

        if ($command->attempt < $request->attempt_version) {
            throw HostReportRefused::staleAttempt($request->id, $command->attempt, $request->attempt_version);
        }

        match ($command->progress) {
            RequestProgress::Applying => $request->beginApplying($command->attempt),
            RequestProgress::Applied => $request->markApplied((string) $command->actualBinding, $command->outcome),
            RequestProgress::DeliveryUncertain => $request->markUncertain(),
            RequestProgress::Failed, RequestProgress::Unavailable => $request->fail($command->outcome ?? RequestOutcome::Refused),
            RequestProgress::Accepted, RequestProgress::Staged, RequestProgress::Superseded, RequestProgress::Cancelled => $request->hold($request->hold_reason),
        };
    }
}
