<?php

declare(strict_types=1);

namespace App\Commands\Inboxes\HandOverInbox;

use App\Commands\Inboxes\JoinInbox\JoinInboxCommand;
use App\Commands\Inboxes\LeaveInbox\LeaveInboxCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Bus\CommandHandler;

/**
 * Runs the join and the leave; it raises no event of its own.
 */
final readonly class HandOverInboxHandler implements CommandHandler
{
    public function __construct(private CommandBus $commands) {}

    public function handle(HandOverInboxCommand $command): void
    {
        $this->commands->run(new JoinInboxCommand($command->inboxId, $command->to));
        $this->commands->run(new LeaveInboxCommand($command->inboxId, [$command->from]));
    }
}
