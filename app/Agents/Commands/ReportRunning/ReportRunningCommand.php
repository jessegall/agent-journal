<?php

declare(strict_types=1);

namespace App\Agents\Commands\ReportRunning;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * The host made a claimed start's process and reports its execution identity: the process, or the thread on its
 * account's sign-in owner. A repeated report changes nothing.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportRunningCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $startKey,
        public string $executionId,
    ) {}
}
