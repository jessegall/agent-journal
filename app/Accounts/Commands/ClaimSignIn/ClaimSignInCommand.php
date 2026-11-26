<?php

declare(strict_types=1);

namespace App\Accounts\Commands\ClaimSignIn;

use App\Accounts\Enums\CommandEntry;
use App\Accounts\Values\ClaimedSignIn;
use App\Attributes\Commands\Entry;
use App\Support\Command;

/**
 * A host's sign-in runner takes the oldest sign-in nobody runs yet; nothing when none waits. Run for an authenticated
 * host by the journal itself (internal, not exported).
 *
 * @extends Command<ClaimedSignIn|null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimSignInCommand extends Command
{
    public function __construct(public string $hostId) {}
}
