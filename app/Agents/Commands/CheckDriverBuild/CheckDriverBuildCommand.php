<?php

declare(strict_types=1);

namespace App\Agents\Commands\CheckDriverBuild;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Judges the build a probe process printed for the start it runs for: a build other than the pinned one ends the
 * start stopped with the pinned-build refusal, and its session and runtime end, before any turn runs; the pinned
 * build has the account's sign-in checked next. Run by the probe's driver worker (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class CheckDriverBuildCommand extends Command
{
    public function __construct(public string $processId, public string $printed) {}
}
