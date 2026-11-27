<?php

declare(strict_types=1);

namespace App\Hosts\Commands\UpgradeHost;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\CommandHandler;
use App\Bus\Contracts\JournalCommands;
use App\Connections\PublishedReleases;
use App\Hosts\Commands\InstructHostUpgrade\InstructHostUpgradeCommand;
use App\Hosts\Commands\StopHostProcess\StopHostProcessCommand;
use App\Hosts\Exceptions\HostUpgradeRefused;
use App\Hosts\Protocol\HostInstructionType;
use App\Models\Hosts\HostProcess;
use App\Models\Projects\Host;
use App\Values\HostInstructionSource;

/**
 * Keeps the release the host waits on, stops each of its live processes, and instructs the upgrade at once when none runs.
 */
final readonly class UpgradeHostHandler implements CommandHandler
{
    private const string TRUSTED_ENTRY = 'host upgrades';

    /**
     * How long a stopped process may take to end on its own, and then to be killed.
     */
    private const int STOP_GRACE_MS = 5000;

    private const int STOP_FORCE_MS = 5000;

    public function __construct(private PublishedReleases $releases, private JournalCommands $commands) {}

    public function handle(UpgradeHostCommand $command): void
    {
        $host = Host::findLocked($command->hostId);
        $published = $this->releases->current()->version;

        if (! $host->carriesOut(HostInstructionType::Upgrade)) {
            throw HostUpgradeRefused::forNoUpgrade($host->id);
        }

        if ($command->release !== $published) {
            throw HostUpgradeRefused::forOtherRelease($command->release, $published);
        }

        $host->awaitUpgrade($command->release);
        $live = HostProcess::findLiveOn($host);

        foreach ($live as $process) {
            $stop = new StopHostProcessCommand(
                $process->id,
                self::STOP_GRACE_MS,
                self::STOP_FORCE_MS,
                HostInstructionSource::fromJournal(),
            );

            $this->commands->runAsJournal(CommandEntry::DriverWorker, self::TRUSTED_ENTRY, $stop);
        }

        if ($live === []) {
            $instruction = new InstructHostUpgradeCommand($host->id);
            $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $instruction);
        }
    }
}
