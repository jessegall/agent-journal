<?php

declare(strict_types=1);

namespace App\Hosts\Commands\SettleHostUpgrade;

use App\Bus\Contracts\CommandHandler;
use App\Hosts\Enums\HostInstructionStatus;
use App\Models\Hosts\HostInstruction;
use App\Models\Projects\Host;

/**
 * Fails the host's upgrade when the host refused its instruction, with the reason the host gave.
 */
final readonly class SettleHostUpgradeHandler implements CommandHandler
{
    public function handle(SettleHostUpgradeCommand $command): void
    {
        $instruction = HostInstruction::findLocked($command->instructionId);

        if ($instruction->status !== HostInstructionStatus::Refused) {
            return;
        }

        $reason = $instruction->answer->reason ?? $instruction->refusal?->value;
        Host::findLocked($instruction->host_id)->failUpgrade("The host refused the upgrade: {$reason}.");
    }
}
