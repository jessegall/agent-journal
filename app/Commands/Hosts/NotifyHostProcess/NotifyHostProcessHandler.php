<?php

declare(strict_types=1);

namespace App\Commands\Hosts\NotifyHostProcess;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Enums\Hosts\HostProcessReportType;
use App\Exceptions\HostProtocolRefused;
use App\Models\Hosts\HostProcess;
use App\Values\ProcessExit;

/**
 * Moves the process row as its host reports; a report about another host's process is refused.
 */
final readonly class NotifyHostProcessHandler implements CommandHandler
{
    public function __construct(private ServerClock $clock) {}

    public function handle(NotifyHostProcessCommand $command): void
    {
        $process = HostProcess::findLocked($command->processId);

        if ($process->host_id !== $command->hostId) {
            throw HostProtocolRefused::foreignProcess($command->hostId, $process->id);
        }

        $report = $command->report;
        $now = $this->clock->now();

        match ($report->report) {
            HostProcessReportType::Running => $process->run($report->identity, $report->generation, $now),
            HostProcessReportType::Restarted => $process->restart($report->identity),
            HostProcessReportType::Exited => $process->exit(
                new ProcessExit($report->exitCode, $report->signal, $report->evidence),
                $now,
            ),
            HostProcessReportType::Lost => $process->lose($report->evidence, $now),
        };
    }
}
