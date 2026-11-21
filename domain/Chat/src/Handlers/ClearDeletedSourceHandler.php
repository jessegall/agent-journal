<?php

declare(strict_types=1);

namespace Domain\Chat\Handlers;

use Domain\Chat\Commands\ClearDeletedSource;
use Domain\Chat\Handlers\Support\ChatCommandHandler;
use Domain\Chat\Models\DockPlacement;
use Illuminate\Database\Eloquent\Collection;

/**
 * Removes a deleted source's placements in bounded batches through the source index; other sources stay.
 */
final readonly class ClearDeletedSourceHandler extends ChatCommandHandler
{
    public const int BATCH_SIZE = 200;

    public function handle(ClearDeletedSource $command): void
    {
        DockPlacement::query()->ofSource($command->source())->readInChunks(
            self::BATCH_SIZE,
            function (Collection $placements): void {
                foreach ($placements as $placement) {
                    $placement->remove();
                }
            },
        );
    }
}
