<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;

/**
 * Ends a sign-in whose deadline has passed; one still within it, or already ended, is left alone. Run by the journal
 * at the deadline and by its reconciliation sweep (internal, not exported).
 *
 * @extends Command<bool>
 */
#[Entry(CommandEntry::AccountMaintenance)]
final readonly class ExpireSignInAttempt extends Command
{
    public function __construct(public string $attemptId) {}
}
