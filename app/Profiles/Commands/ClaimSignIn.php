<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Attributes\HandledBy;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Handlers\ClaimSignInHandler;
use App\Profiles\Values\ClaimedSignIn;

/**
 * A host's sign-in runner takes the oldest sign-in nobody runs yet; nothing when none waits. Run for an authenticated
 * host by the journal itself (internal, not exported).
 *
 * @extends Command<ClaimedSignIn|null>
 */
#[HandledBy(ClaimSignInHandler::class)]
#[Entry(CommandEntry::HostControl)]
final readonly class ClaimSignIn extends Command
{
    public function __construct(public string $hostId) {}
}
