<?php

declare(strict_types=1);

namespace App\Agents\Commands\RefuseProvenStart;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Refuses the start of a runtime whose start was proven but whose next process could not open, with the reason the
 * opening was refused for; its session ends with it (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class RefuseProvenStartCommand extends Command
{
    public function __construct(public string $runtimeId, public string $refusal) {}
}
