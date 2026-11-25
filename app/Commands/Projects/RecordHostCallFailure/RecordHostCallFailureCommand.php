<?php

declare(strict_types=1);

namespace App\Commands\Projects\RecordHostCallFailure;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Keeps a server error the journal answered a host's call with, for the alarm a failing host link raises. Run for an
 * authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordHostCallFailureCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $route,
        public int $status,
        public string $reason,
    ) {}
}
