<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\DriverFailure;
use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * The host reports that a claimed start's program failed, in the checked vocabulary, after it proved the process
 * gone: the start ends, and the safe failure is published once for recovery.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ReportFailure extends Command
{
    public function __construct(
        public string $hostId,
        public string $startKey,
        public DriverFailure $failure,
    ) {}
}
