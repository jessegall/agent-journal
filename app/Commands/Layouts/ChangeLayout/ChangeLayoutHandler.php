<?php

declare(strict_types=1);

namespace App\Commands\Layouts\ChangeLayout;

use App\Contracts\Bus\CommandHandler;
use App\Models\Records\Layout;

final readonly class ChangeLayoutHandler implements CommandHandler
{
    public function handle(ChangeLayoutCommand $command): void
    {
        Layout::lockedForChange($command->layoutId)->saveNameAndShape($command->name, $command->shape);
    }
}
