<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\Hosts\OrderHostUpgrade\OrderHostUpgradeCommand;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Contracts\Hosts\HostProcessEndEvent;
use App\Enums\Accounts\CommandEntry;
use App\Models\Hosts\HostProcess;

/**
 * When the last process of a host that waits on an upgrade ends, the upgrade is ordered.
 */
final readonly class OrderUpgradeOfQuietHost implements Listener
{
    private const string TRUSTED_ENTRY = 'host upgrades';

    public function __construct(private JournalCommands $commands) {}

    public function handle(HostProcessEndEvent $fact): void
    {
        $host = HostProcess::query()->with('host')->whereKey($fact->processId)->sole()->host;

        if (! $host->awaitsUpgradeOrder() || HostProcess::query()->onHost($host)->live()->exists()) {
            return;
        }

        $command = new OrderHostUpgradeCommand($host->id);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $command);
    }
}
