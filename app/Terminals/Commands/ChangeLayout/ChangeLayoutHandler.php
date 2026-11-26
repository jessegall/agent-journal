<?php

declare(strict_types=1);

namespace App\Terminals\Commands\ChangeLayout;

use App\Bus\Contracts\CommandHandler;
use App\Models\Records\Layout;

final readonly class ChangeLayoutHandler implements CommandHandler
{
    public function handle(ChangeLayoutCommand $command): void
    {
        Layout::findLockedForChange($command->layoutId)->saveNameAndShape($command->name, $command->shape);
    }
}
