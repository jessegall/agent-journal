<?php

declare(strict_types=1);

namespace App\Hosts\Commands\NotifyHostProcess;

use App\Bus\Contracts\CommandHandler;
use App\Exceptions\HostProtocolRefused;
use App\Hosts\Protocol\HostProcessReportType;
use App\Hosts\Protocol\Payloads\HostProcessReportPayload;
use App\Hosts\Values\ProcessExit;
use App\Models\Hosts\HostProcess;
use App\Time\Contracts\ServerClock;

/**
 * Moves the process row as its host reports; a report about another host's process is refused.
 */
final readonly class NotifyHostProcessHandler implements CommandHandler
{
    /**
     * How many of the last characters a program printed the evidence of its exit keeps.
     */
    private const int EVIDENCE_CHARACTERS = 1000;

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
                new ProcessExit($report->exitCode, $report->signal, $this->exitEvidenceOf($report)),
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
    private function identityOf(HostProcessReportPayload $report): string
    {
        return $report->identity ?? throw HostProtocolRefused::reportWithoutIdentity($report->processId);
    }

    /**
     * How an exited process ended, worded from what the host reported: killed for its memory, or its exit code with
     * the last of what it printed, its terminal's colours left out.
     */
    private function exitEvidenceOf(HostProcessReportPayload $report): string
    {
        if ($report->isOutOfMemory) {
            return 'the container was killed for using more memory than its budget';
        }

        $evidence = $report->signal === null
            ? "the program exited with {$report->exitCode}"
            : "the program was ended by {$report->signal}";

        $printed = trim((string) preg_replace('/\e\[[0-9;?]*[ -\/]*[@-~]/', '', $report->lastPrinted ?? ''));

        if ($printed === '') {
            return $evidence;
        }

        return $evidence.': '.mb_substr($printed, -self::EVIDENCE_CHARACTERS);
    }

    /**
     * How a lost process ended, which its report must say.
     *
     * @throws HostProtocolRefused
     */
    private function evidenceOf(HostProcessReportPayload $report): string
    {
        return $report->evidence ?? throw HostProtocolRefused::reportWithoutEvidence($report->processId);
    }
}
