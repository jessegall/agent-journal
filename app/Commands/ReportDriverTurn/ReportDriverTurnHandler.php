<?php

declare(strict_types=1);

namespace App\Commands\ReportDriverTurn;

use App\Contracts\Bus\CommandHandler;
use App\Enums\HoldReason;
use App\Enums\RuntimeActivity;
use App\Exceptions\HostReportRefused;
use App\Models\Drivers\DriverTurn;
use App\Support\HostRuntimes;
use Carbon\CarbonImmutable;

final readonly class ReportDriverTurnHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes) {}

    /**
     * A started turn sets the runtime Running; a finished one closes the turn and sets it Idle.
     */
    public function handle(ReportDriverTurnCommand $command): void
    {
        $runtime = $this->runtimes->lockedFor($command->hostId, $command->runtimeId);
        $now = CarbonImmutable::now();

        $turn = DriverTurn::recordStart($runtime->id, $command->processGeneration, $command->nativePromptId, $now);

        $activity = $command->finished ? RuntimeActivity::Idle : RuntimeActivity::Running;

        if (! $runtime->recordObservation($activity, HoldReason::None, $command->processGeneration, $now)) {
            throw HostReportRefused::staleGeneration(
                $runtime->id,
                $command->processGeneration,
                $runtime->process_generation,
            );
        }

        $runtime->observeSettings($command->model, $command->effort, $now);

        if ($command->finished) {
            $turn->finish((string) ($command->outcome ?? 'finished'), $now);
        }
    }
}
