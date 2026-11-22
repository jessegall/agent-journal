<?php

declare(strict_types=1);

namespace App\Profiles\Listeners;

use App\Agents\Commands\FailDriverSwitchLaunch\FailDriverSwitchLaunchCommand;
use App\Agents\Events\DriverSwitchStopped;
use App\Bus\Contracts\JournalCommands;
use App\Bus\Enums\CommandEntry;
use App\Contracts\CommandRefusal;
use App\Contracts\Listener;
use App\Profiles\Commands\StartSwitchReplacement\StartSwitchReplacementCommand;

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
