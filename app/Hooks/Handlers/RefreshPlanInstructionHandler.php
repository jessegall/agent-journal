<?php

declare(strict_types=1);

namespace App\Hooks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Commands\RefreshPlanInstruction;
use App\Hooks\Support\ReservedInstructions;

final readonly class RefreshPlanInstructionHandler implements CommandHandler
{
    public function __construct(private ReservedInstructions $instructions) {}

    public function handle(RefreshPlanInstruction $command): void
    {
        $this->instructions->refresh(RefreshPlanInstruction::class, $command->planId);
    }
}
