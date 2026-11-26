<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Events\Connections\HostProcessLost;
use App\Hosts\Commands\JudgeIsolationProbe\JudgeIsolationProbeCommand;
use App\Hosts\Enums\HostProcessPurpose;
use App\Models\Hosts\HostProcess;

/**
 * An isolation probe whose program never started is lost rather than ended, so it is judged failed with why the host
 * lost it; otherwise the host would keep no verdict and no protection report.
 */
final readonly class JudgeLostIsolationProbe implements Listener
{
    private const string TRUSTED_ENTRY = 'host protection';

    public function __construct(private JournalCommands $commands) {}

    public function handle(HostProcessLost $fact): void
    {
        $process = HostProcess::query()->whereKey($fact->processId)->sole();

        if (in_array($process->purpose, HostProcessPurpose::isolationProbes(), true)) {
            $judge = new JudgeIsolationProbeCommand($process->id, $fact->evidence);
            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $judge);
        }
    }
}
