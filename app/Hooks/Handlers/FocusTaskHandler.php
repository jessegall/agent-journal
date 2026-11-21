<?php

declare(strict_types=1);

namespace App\Hooks\Handlers;

use App\Contracts\CommandHandler;
use App\Hooks\Commands\FocusTask;
use App\Hooks\Support\ReservedInstructions;

final readonly class FocusTaskHandler implements CommandHandler
{
    public function __construct(private ReservedInstructions $instructions) {}

    public function handle(FocusTask $command): void
    {
        $this->instructions->focus(FocusTask::class, 'tasks.task');
    }
}
