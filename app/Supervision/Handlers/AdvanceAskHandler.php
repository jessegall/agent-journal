<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Actors\Contracts\ServerClock;
use App\Assignments\Contracts\MaintenanceAdmission;
use App\Contracts\CommandHandler;
use App\Supervision\Commands\AdvanceAsk;
use App\Supervision\Models\Ask;
use App\Supervision\Models\AskHop;
use App\Supervision\Support\AskEscalation;

/**
 * Advances the ask under the engine's grant; an ask answered or closed since it was found due is left alone.
 */
final readonly class AdvanceAskHandler implements CommandHandler
{
    public function __construct(
        private MaintenanceAdmission $access,
        private AskEscalation $escalation,
        private ServerClock $clock,
    ) {}

    public function handle(AdvanceAsk $command): void
    {
        $this->access->assertMaintenanceGranted(AdvanceAsk::MAINTENANCE_SCOPE);
        $ask = Ask::lockedForMaintenance($command->askId);
        $hop = AskHop::currentFor($ask);

        if ($ask->open && $hop->result === null) {
            $this->escalation->advance($ask, $hop, $this->clock->now());
        }
    }
}
