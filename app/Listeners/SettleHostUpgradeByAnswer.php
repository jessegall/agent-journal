<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Hosts\Commands\SettleHostUpgrade\SettleHostUpgradeCommand;
use App\Hosts\Contracts\HostOrderAnswerEvent;
use App\Hosts\Enums\HostOrderType;

/**
 * The host's answer to its upgrade order, or its refusal, settles the upgrade it waits on.
 */
final readonly class SettleHostUpgradeByAnswer implements Listener
{
    private const string TRUSTED_ENTRY = 'host upgrades';

    public function __construct(private JournalCommands $commands) {}

    public function handle(HostOrderAnswerEvent $fact): void
    {
        if ($fact->type !== HostOrderType::Upgrade) {
            return;
        }

        $command = new SettleHostUpgradeCommand($fact->orderId);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $command);
    }
}
