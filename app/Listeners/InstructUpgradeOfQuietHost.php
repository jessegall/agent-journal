<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Hosts\Commands\InstructHostUpgrade\InstructHostUpgradeCommand;
use App\Hosts\Contracts\HostProcessEndEvent;
use App\Models\Hosts\HostProcess;

/**
 * When the last process of a host that waits on an upgrade ends, the upgrade is ordered.
 */
final readonly class InstructUpgradeOfQuietHost implements Listener
{
    private const string TRUSTED_ENTRY = 'host upgrades';

    public function __construct(private JournalCommands $commands) {}

    public function handle(HostProcessEndEvent $fact): void
    {
        $host = HostProcess::query()->with('host')->whereKey($fact->processId)->sole()->host;

        if (! $host->awaitsUpgradeInstruction() || HostProcess::query()->onHost($host)->live()->exists()) {
            return;
        }

        $command = new InstructHostUpgradeCommand($host->id);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $command);
    }
}
