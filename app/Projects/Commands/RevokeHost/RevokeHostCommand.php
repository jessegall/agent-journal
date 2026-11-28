<?php

declare(strict_types=1);

namespace App\Projects\Commands\RevokeHost;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Revokes every host still enrolled under an installation name, so a machine that is gone stops calling and stops
 * raising its alarms; it answers how many it revoked.
 *
 * @extends Command<int>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RevokeHostCommand extends Command
{
    public function __construct(public string $installationName) {}
}
