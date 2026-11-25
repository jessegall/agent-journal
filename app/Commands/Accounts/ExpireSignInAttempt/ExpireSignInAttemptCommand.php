<?php

declare(strict_types=1);

namespace App\Commands\Accounts\ExpireSignInAttempt;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
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
