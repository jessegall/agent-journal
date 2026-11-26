<?php

declare(strict_types=1);

namespace App\Accounts\Commands\CleanSignInAttempt;

use App\Accounts\Enums\CommandEntry;
use App\Accounts\Values\CleanupProgress;
use App\Attributes\Commands\Entry;
use App\Support\Command;

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
