<?php

declare(strict_types=1);

namespace App\Inboxes\Commands\HandOverInbox;

use App\Bus\Contracts\CommandBus;
use App\Bus\Contracts\CommandHandler;
use App\Inboxes\Commands\JoinInbox\JoinInboxCommand;
use App\Inboxes\Commands\LeaveInbox\LeaveInboxCommand;

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
