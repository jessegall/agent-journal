<?php

declare(strict_types=1);

namespace App\Profiles\Commands\ClaimSignIn;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Values\ClaimedSignIn;

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
