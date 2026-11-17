<?php

declare(strict_types=1);

namespace App\Domain\Processes\Support;

use App\Domain\Processes\Models\SavedCommand;

/**
 * The named read of the saved commands Processes keeps.
 */
final readonly class SavedCommands
{
    public function isSaved(string $name): bool
    {
        return SavedCommand::query()->where('name', $name)->exists();
    }
}
