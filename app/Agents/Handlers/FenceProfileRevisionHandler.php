<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Agents\Commands\FenceProfileRevision;
use App\Agents\Models\RevisionFence;
use App\Contracts\CommandHandler;

/**
 * Keeps the fence for host reconciliation and answers the id of the fence.
 */
final readonly class FenceProfileRevisionHandler implements CommandHandler
{
    public function handle(FenceProfileRevision $command): string
    {
        return RevisionFence::retain($command->revisionReference)->id;
    }
}
