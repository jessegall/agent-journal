<?php

declare(strict_types=1);

namespace App\Commands\Sessions\HoldProfileRevision;

use App\Contracts\Bus\CommandHandler;
use App\Models\Profiles\ProfileRevisionHold;

/**
 * Keeps the fence for host reconciliation and answers the id of the fence.
 */
final readonly class HoldProfileRevisionHandler implements CommandHandler
{
    public function handle(HoldProfileRevisionCommand $command): string
    {
        return ProfileRevisionHold::create($command->key, $command->revision)->id;
    }
}
