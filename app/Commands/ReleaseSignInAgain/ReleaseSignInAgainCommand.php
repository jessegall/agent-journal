<?php

declare(strict_types=1);

namespace App\Commands\ReleaseSignInAgain;

use App\Attributes\Entry;
use App\Enums\CommandEntry;
use App\Support\Command;

/**
 * Lets a host take a sign-in again once no process runs on the account's folder: the account's pending starts are
 * cancelled and its running ones must have ended. Run by the journal itself (internal, not exported).
 *
 * @extends Command<bool>
 */
#[Entry(CommandEntry::AccountMaintenance)]
final readonly class ReleaseSignInAgainCommand extends Command
{
    public function __construct(public string $attemptId) {}
}
