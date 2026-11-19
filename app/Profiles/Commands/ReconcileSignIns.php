<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\ReconcileSignInsHandler;

/**
 * A host's runner says, when it starts, which of its sign-ins it still runs: every other live attempt it took ends as
 * interrupted, so none waits for its deadline and none is started again blindly. Run for an authenticated host by the
 * journal itself (internal, not exported).
 *
 * @extends Command<int>
 */
#[HandledBy(ReconcileSignInsHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class ReconcileSignIns extends Command
{
    /**
     * @param  list<string>  $runningAttemptIds
     */
    public function __construct(
        public string $hostId,
        public array $runningAttemptIds,
    ) {}
}
