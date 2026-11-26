<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\Hosts\SettleHostUpgrade\SettleHostUpgradeCommand;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Contracts\Hosts\HostOrderAnswerEvent;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Hosts\HostOrderType;

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
