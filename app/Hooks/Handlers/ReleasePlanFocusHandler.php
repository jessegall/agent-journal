<?php

declare(strict_types=1);

namespace App\Hooks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Commands\ReleasePlanFocus;
use App\Hooks\Support\ReservedInstructions;

final readonly class ReleasePlanFocusHandler implements CommandHandler
{
    public function __construct(private ReservedInstructions $instructions) {}

    public function handle(ReleasePlanFocus $command): void
    {
        $this->instructions->release(ReleasePlanFocus::class);
    }
}
