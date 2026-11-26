<?php

declare(strict_types=1);

namespace App\Terminals\Commands\DeleteLayout;

use App\Bus\Contracts\CommandHandler;
use App\Models\Records\Layout;

final readonly class DeleteLayoutHandler implements CommandHandler
{
    public function handle(DeleteLayoutCommand $command): void
    {
        Layout::findLockedForChange($command->layoutId)->remove();
    }
}
