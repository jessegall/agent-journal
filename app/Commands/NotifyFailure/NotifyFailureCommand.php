<?php

declare(strict_types=1);

namespace App\Commands\NotifyFailure;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Enums\DriverFailure;
use App\Support\Command;

/**
 * The host reports that a claimed start's driver failed, in the checked vocabulary, after it proved the process
 * gone: the start ends, and the safe failure is published once for recovery.
 * Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifyFailureCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $startKey,
        public DriverFailure $failure,
    ) {}
}
