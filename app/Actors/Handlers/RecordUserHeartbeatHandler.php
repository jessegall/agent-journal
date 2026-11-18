<?php

declare(strict_types=1);

namespace App\Actors\Handlers;

use App\Actors\Commands\RecordUserHeartbeat;
use App\Actors\Contracts\CurrentActor;
use App\Actors\Models\UserPresence;
use App\Actors\Support\DatabaseClock;
use App\Contracts\CommandHandler;

final readonly class RecordUserHeartbeatHandler implements CommandHandler
{
    public function __construct(
        private CurrentActor $actors,
        private DatabaseClock $clock,
    ) {}

    public function handle(RecordUserHeartbeat $command): void
    {
        UserPresence::recordFor($this->actors->actor()->id, $this->clock->now());
    }
}
