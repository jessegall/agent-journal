<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Agents\Commands\ReportWorkspaceRead;
use App\Agents\Contracts\ActorGuidance;
use App\Agents\Models\WorkspaceRead;
use App\Agents\Values\WorkspaceFacts;
use App\Contracts\CommandHandler;

/**
 * Records the host's sample on the read it answers and wakes the actor that waits on it.
 */
final readonly class ReportWorkspaceReadHandler implements CommandHandler
{
    public const string ANSWERED = 'The host read your workspace for your profile\'s script; stop again to go on.';

    public function __construct(private ServerClock $clock, private ActorGuidance $guidance) {}

    public function handle(ReportWorkspaceRead $command): void
    {
        $read = WorkspaceRead::byReference($command->reference);
        $read->answer(new WorkspaceFacts(
            $command->isAvailable,
            $command->isDirty,
            $command->isClean,
            $command->generation,
            $this->clock->now(),
        ));
        $this->guidance->retain($read->actor(), self::ANSWERED, $read->read_reference);
    }
}
