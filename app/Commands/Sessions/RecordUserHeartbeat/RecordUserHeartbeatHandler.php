<?php

declare(strict_types=1);

namespace App\Commands\Sessions\RecordUserHeartbeat;

use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Presence\UserPresence;

final readonly class RecordUserHeartbeatHandler implements CommandHandler
{
    public function __construct(
        private ServerClock $clock,
    ) {}

    public function handle(RecordUserHeartbeatCommand $command): void
    {
        $now = $this->clock->now();
        UserPresence::create($command->dispatchedBy()->id, $now)->beatAt($now);
    }
}
