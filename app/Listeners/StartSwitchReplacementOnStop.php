<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\FailDriverSwitchLaunch\FailDriverSwitchLaunchCommand;
use App\Commands\StartSwitchReplacement\StartSwitchReplacementCommand;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Enums\CommandEntry;
use App\Events\DriverSwitchStopped;

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
                new FailDriverSwitchLaunchCommand($fact->switchId, $refused->getMessage()),
            );
        }
    }
}
