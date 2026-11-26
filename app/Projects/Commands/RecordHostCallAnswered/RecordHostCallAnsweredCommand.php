<?php

declare(strict_types=1);

namespace App\Projects\Commands\RecordHostCallAnswered;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Hosts\Data\FailedHostCallData;
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
     * @param  list<FailedHostCallData>  $reportedFailures
     */
    public function __construct(
        public string $hostId,
        public string $route,
        public array $reportedFailures,
    ) {}
}
