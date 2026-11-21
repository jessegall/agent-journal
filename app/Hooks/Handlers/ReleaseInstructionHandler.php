<?php

declare(strict_types=1);

namespace App\Hooks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Commands\ReleaseInstruction;
use App\Hooks\Support\ReservedInstructions;

final readonly class ReleaseInstructionHandler implements CommandHandler
{
    public function __construct(private ReservedInstructions $instructions) {}

    public function handle(ReleaseInstruction $command): void
    {
        $this->instructions->release(ReleaseInstruction::class);
    }
}
