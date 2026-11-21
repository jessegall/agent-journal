<?php

declare(strict_types=1);

namespace App\Hooks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Commands\ReleaseTaskFocus;
use App\Hooks\Support\ReservedInstructions;

final readonly class ReleaseTaskFocusHandler implements CommandHandler
{
    public function __construct(private ReservedInstructions $instructions) {}

    public function handle(ReleaseTaskFocus $command): void
    {
        $this->instructions->release(ReleaseTaskFocus::class);
    }
}
