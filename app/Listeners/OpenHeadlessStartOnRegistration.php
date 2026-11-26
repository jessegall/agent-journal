<?php

declare(strict_types=1);

namespace App\Listeners;

use App\Commands\Agents\OpenHeadlessStart\OpenHeadlessStartCommand;
use App\Contracts\Bus\JournalCommands;
use App\Contracts\Events\Listener;
use App\Enums\Accounts\CommandEntry;
use App\Events\Sessions\SessionProcessRegistered;

/**
 * A registered start of a headless Claude Code runtime is opened by the journal itself, once its start committed; any
 * other start waits for its host's claim.
 */
final readonly class OpenHeadlessStartOnRegistration implements Listener
{
    private const string TRUSTED_ENTRY = 'headless starts';

    public function __construct(private JournalCommands $commands) {}

    public function handle(SessionProcessRegistered $fact): void
    {
        $this->commands->runAsJournal(
            CommandEntry::DriverWorker,
            self::TRUSTED_ENTRY,
            new OpenHeadlessStartCommand($fact->sessionId),
        );
    }
}
