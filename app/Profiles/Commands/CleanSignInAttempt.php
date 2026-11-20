<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\CleanSignInAttemptHandler;
use App\Profiles\Values\CleanupProgress;

/**
 * The host reports what it proved of the cleanup of an unfinished new account's sign-in: its store gone and its
 * folder gone. Run for an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<bool>
 */
#[Entry(CommandEntry::HostControl)]
#[HandledBy(CleanSignInAttemptHandler::class)]
final readonly class CleanSignInAttempt extends Command
{
    public function __construct(
        public string $hostId,
        public string $attemptId,
        public CleanupProgress $progress,
    ) {}
}
