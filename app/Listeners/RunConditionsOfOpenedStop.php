<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\Sessions\RunStopConditions\RunStopConditionsCommand;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Enums\Accounts\CommandEntry;
use App\Events\Sessions\StopCheckOpened;

/**
 * A stop that opened its attempt has its conditions run on the session's host.
 */
final readonly class RunConditionsOfOpenedStop implements Listener
{
    private const string TRUSTED_ENTRY = 'stop conditions';

    public function __construct(private JournalCommands $commands) {}

    public function handle(StopCheckOpened $fact): void
    {
        $command = new RunStopConditionsCommand($fact->attemptId);
        $this->commands->runAsJournal(CommandEntry::HostControl, self::TRUSTED_ENTRY, $command);
    }
}
