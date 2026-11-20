<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\ReleaseSignInAgainHandler;

/**
 * Lets a host take a sign-in again once no process runs on the account's folder: the account's pending starts are
 * cancelled and its running ones must have ended. Run by the journal itself (internal, not exported).
 *
 * @extends Command<bool>
 */
#[Entry(CommandEntry::AccountMaintenance)]
#[HandledBy(ReleaseSignInAgainHandler::class)]
final readonly class ReleaseSignInAgain extends Command
{
    public function __construct(public string $attemptId) {}
}
