<?php

declare(strict_types=1);

namespace App\Commands\DeleteLayout;

use App\Contracts\Bus\CommandHandler;
use App\Models\Records\Layout;

final readonly class DeleteLayoutHandler implements CommandHandler
{
    public function handle(DeleteLayoutCommand $command): void
    {
        Layout::lockedForChange($command->layoutId)->remove();
    }
}
