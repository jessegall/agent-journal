<?php

declare(strict_types=1);

namespace App\Commands\RecordHostCallAnswered;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * Keeps that the journal answered a host's call, which ends a failing link, with the calls the host reported failed
 * on its own side. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RecordHostCallAnsweredCommand extends Command
{
    /**
     * @param  list<array{route: string, status: int, reason: string, since: string}>  $reportedFailures
     */
    public function __construct(
        public string $hostId,
        public array $reportedFailures,
    ) {}
}
