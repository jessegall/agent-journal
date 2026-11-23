<?php

declare(strict_types=1);

namespace App\Commands\FenceProfileRevision;

use App\Contracts\Bus\CommandHandler;
use App\Models\Starts\RevisionFence;

/**
 * Keeps the fence for host reconciliation and answers the id of the fence.
 */
final readonly class FenceProfileRevisionHandler implements CommandHandler
{
    public function handle(FenceProfileRevisionCommand $command): string
    {
        return RevisionFence::retain($command->key, $command->revision)->id;
    }
}
