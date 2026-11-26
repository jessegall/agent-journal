<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Agents\Commands\StartSwitchReplacement\StartSwitchReplacementCommand;
use App\Agents\Drivers\Commands\FailDriverSwitchStart\FailDriverSwitchStartCommand;
use App\Bus\Contracts\CommandRefusal;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Events\Sessions\DriverSwitchStopped;

/**
 * Once a switch's old session is proven stopped and that has committed, starts its replacement; a refused start is
 * recorded on the switch in a command of its own, since the refusal rolls the replacement back.
 */
final readonly class StartSwitchReplacementOnStop implements Listener
{
    public function __construct(private JournalCommands $journal) {}

    public function handle(DriverSwitchStopped $fact): void
    {
        try {
            $this->journal->runAsJournal(
                CommandEntry::HostControl,
                'driver switch',
                new StartSwitchReplacementCommand($fact->switchId),
            );
        } catch (CommandRefusal $refused) {
            $this->journal->runAsJournal(
                CommandEntry::HostControl,
                'driver switch',
                new FailDriverSwitchStartCommand($fact->switchId, $refused->getMessage()),
            );
        }
    }
}
