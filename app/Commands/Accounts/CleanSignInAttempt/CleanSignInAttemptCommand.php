<?php

declare(strict_types=1);

namespace App\Commands\Accounts\CleanSignInAttempt;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\CleanupProgress;

/**
 * The host reports what it proved of the cleanup of an unfinished new account's sign-in: its store gone and its
 * folder gone. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<bool>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class CleanSignInAttemptCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $attemptId,
        public CleanupProgress $progress,
    ) {}
}
