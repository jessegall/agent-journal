<?php

declare(strict_types=1);

namespace App\Hooks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Commands\FocusInstruction;
use App\Hooks\Support\ReservedInstructions;

final readonly class FocusInstructionHandler implements CommandHandler
{
    public function __construct(private ReservedInstructions $instructions) {}

    public function handle(FocusInstruction $command): void
    {
        $this->instructions->focus(FocusInstruction::class);
    }
}
