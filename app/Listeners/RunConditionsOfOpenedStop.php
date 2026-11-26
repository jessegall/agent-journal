<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Accounts\Enums\CommandEntry;
use App\Bus\Contracts\JournalCommands;
use App\Contracts\Events\Listener;
use App\Events\Sessions\StopCheckOpened;
use App\Sessions\Commands\RunStopConditions\RunStopConditionsCommand;

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
