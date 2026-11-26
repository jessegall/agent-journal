<?php

declare(strict_types=1);

namespace App\Accounts\Commands\ExpireSignInAttempt;

use App\Accounts\Enums\CommandEntry;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * Ends a sign-in whose deadline has passed; one still within it, or already ended, is left alone. Run by the journal
 * at the deadline and by its reconciliation sweep (internal, not exported).
 *
 * @extends Command<bool>
 */
#[Entry(CommandEntry::AccountMaintenance)]
final readonly class ExpireSignInAttemptCommand extends Command
{
    public function __construct(public string $attemptId) {}
}
