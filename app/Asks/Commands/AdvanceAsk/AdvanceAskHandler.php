<?php

declare(strict_types=1);

namespace App\Asks\Commands\AdvanceAsk;

use App\Access\Contracts\MaintenanceAdmission;
use App\Asks\AskEscalation;
use App\Bus\Contracts\CommandHandler;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Time\Contracts\ServerClock;

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

    public function handle(AdvanceAskCommand $command): void
    {
        $this->access->assertMaintenanceGranted(AdvanceAskCommand::MAINTENANCE_SCOPE);
        $ask = Ask::findLockedForMaintenance($command->askId);
        $hop = AskHop::findCurrentFor($ask);

        if ($ask->open && $hop->result === null) {
            $this->escalation->advance($ask, $hop, $this->clock->now());
        }
    }
}
