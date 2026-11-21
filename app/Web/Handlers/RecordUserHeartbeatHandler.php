<?php

declare(strict_types=1);

namespace App\Web\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Actors\Models\UserPresence;
use App\Contracts\CommandHandler;
use App\Web\Commands\RecordUserHeartbeat;

final readonly class RecordUserHeartbeatHandler implements CommandHandler
{
    public function __construct(
        private ServerClock $clock,
    ) {}

    public function handle(RecordUserHeartbeat $command): void
    {
        $now = $this->clock->now();
        UserPresence::lockedFor($command->dispatchedBy()->id, $now)->beatAt($now);
    }
}
