<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Values\SignInPoll;

/**
 * The host's runner asks, in the generation it runs in, whether its attempt is still live, and takes the code the
 * user typed, once; an ended attempt forgets its code and challenge. Run for
 * an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<SignInPoll>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class TakeSignInCode extends Command
{
    public function __construct(
        public string $hostId,
        public string $attemptId,
        public int $generation,
    ) {}
}
