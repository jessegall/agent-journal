<?php

declare(strict_types=1);

namespace App\Commands\ReportWorkspaceRead;

use App\Contracts\Actors\ActorGuidance;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\WorkspaceRead;
use App\Values\WorkspaceFacts;

/**
 * Records the host's sample on the read it answers and wakes the actor that waits on it.
 */
final readonly class ReportWorkspaceReadHandler implements CommandHandler
{
    public const string ANSWERED = 'The host read your workspace for your profile\'s script; stop again to go on.';

    public function __construct(private ServerClock $clock, private ActorGuidance $guidance) {}

    public function handle(ReportWorkspaceReadCommand $command): void
    {
        $read = WorkspaceRead::byReference($command->reference);

        $read->answer(new WorkspaceFacts(
            $command->isAvailable,
            $command->isDirty,
            $command->isClean,
            $command->generation,
            $this->clock->now(),
            $command->commit,
        ));

        $this->guidance->retain($read->actor(), self::ANSWERED, $read->read_reference);
    }
}
