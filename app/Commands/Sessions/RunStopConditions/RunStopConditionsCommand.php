<?php

declare(strict_types=1);

namespace App\Commands\Sessions\RunStopConditions;

use App\Attributes\Commands\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;

/**
 * Runs an opened stop attempt's conditions under the session's fence on the host its runtime runs on. Run by the
 * journal itself when a stop opens its attempt (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class RunStopConditionsCommand extends Command
{
    public function __construct(public string $attemptId) {}
}
