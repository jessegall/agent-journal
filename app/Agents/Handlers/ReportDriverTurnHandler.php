<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\ReportDriverTurn;
use App\Agents\Enums\HoldReason;
use App\Agents\Enums\RuntimeActivity;
use App\Agents\Exceptions\HostReportRefused;
use App\Agents\Models\DriverTurn;
use App\Agents\Support\HostRuntimes;
use App\Contracts\CommandHandler;
use Carbon\CarbonImmutable;

final readonly class ReportDriverTurnHandler implements CommandHandler
{
    public function __construct(private HostRuntimes $runtimes) {}

    /**
     * A started turn sets the runtime Running; a finished one closes the turn and sets it Idle (doc 40, section 12).
     */
    public function handle(ReportDriverTurn $command): void
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
