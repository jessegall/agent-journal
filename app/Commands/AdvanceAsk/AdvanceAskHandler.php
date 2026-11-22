<?php

declare(strict_types=1);

namespace App\Commands\AdvanceAsk;

use App\Contracts\Admission\MaintenanceAdmission;
use App\Contracts\Bus\CommandHandler;
use App\Contracts\Time\ServerClock;
use App\Models\Ask;
use App\Models\AskHop;
use App\Support\AskEscalation;

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
        $ask = Ask::lockedForMaintenance($command->askId);
        $hop = AskHop::currentFor($ask);

        if ($ask->open && $hop->result === null) {
            $this->escalation->advance($ask, $hop, $this->clock->now());
        }
    }
}
