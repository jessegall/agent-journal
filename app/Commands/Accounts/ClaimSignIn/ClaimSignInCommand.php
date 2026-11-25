<?php

declare(strict_types=1);

namespace App\Commands\Accounts\ClaimSignIn;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\ClaimedSignIn;

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
