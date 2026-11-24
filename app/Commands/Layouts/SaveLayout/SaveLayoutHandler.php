<?php

declare(strict_types=1);

namespace App\Commands\Layouts\SaveLayout;

use App\Contracts\Bus\CommandHandler;
use App\Models\Records\Layout;

final readonly class SaveLayoutHandler implements CommandHandler
{
    public function handle(SaveLayoutCommand $command): void
    {
        Layout::create($command->dispatchedBy()->id, $command->name, $command->shape);
    }
}
