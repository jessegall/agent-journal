<?php

declare(strict_types=1);

namespace App\Hooks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Commands\FocusPlan;
use App\Hooks\Support\ReservedInstructions;

final readonly class FocusPlanHandler implements CommandHandler
{
    public function __construct(private ReservedInstructions $instructions) {}

    public function handle(FocusPlan $command): void
    {
        $this->instructions->focus(FocusPlan::class, 'plans.plan');
    }
}
