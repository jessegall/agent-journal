<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\HostProtocolRefused;
use App\Hosts\Protocol\Data\HostProcessReportData;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Values\ProcessExit;
use App\Models\Hosts\HostProcess;
use App\Time\Contracts\ServerClock;

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
            HostProcessReportType::Running => $process->run($this->identityOf($report), $report->generation, $now),
            HostProcessReportType::Restarted => $process->restart($this->identityOf($report)),
            HostProcessReportType::Exited => $process->exit(
                new ProcessExit($report->exitCode, $report->signal, $this->evidenceOf($report)),
                $now,
            ),
            HostProcessReportType::Lost => $process->lose($this->evidenceOf($report), $now),
        };
    }

    /**
     * The identity a running or restarted process runs under, which its report must name.
     *
     * @throws HostProtocolRefused
     */
    private function identityOf(HostProcessReportData $report): string
    {
        return $report->identity ?? throw HostProtocolRefused::reportWithoutIdentity($report->processId);
    }

    /**
     * How an exited or lost process ended, which its report must say.
     *
     * @throws HostProtocolRefused
     */
    private function evidenceOf(HostProcessReportData $report): string
    {
        return $report->evidence ?? throw HostProtocolRefused::reportWithoutEvidence($report->processId);
    }
}
