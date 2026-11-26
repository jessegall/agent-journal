<?php

declare(strict_types=1);

namespace App\Agents\Commands\CheckSignIn;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Judges what a sign-in probe printed for the start it runs for: an account signed in by a method the journal accepts,
 * in its own folder, proves the start and lets its first turn open; any other answer ends the start stopped as not
 * signed in, and its session and runtime end. Run by the probe's driver worker (internal, not exported).
 *
 * @extends Command<void>
 */
#[Entry(CommandEntry::DriverWorker)]
final readonly class CheckSignInCommand extends Command
{
    public function __construct(public string $processId, public string $printed) {}
}
