<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReportRuntimeActivity;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Support\HostRuntimes;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

final readonly class ReportRuntimeActivityHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes) {}

    public function handle(ReportRuntimeActivity $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);

        if (! $runtime->recordObservation($command->activity, $command->hold, $command->processGeneration, CarbonImmutable::now())) {
            throw HostReportRefused::staleGeneration($runtime->id, $command->processGeneration, $runtime->process_generation);
        }
    }
}
