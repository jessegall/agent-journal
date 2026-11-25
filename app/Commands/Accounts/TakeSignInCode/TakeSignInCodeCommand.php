<?php

declare(strict_types=1);

namespace App\Commands\Accounts\TakeSignInCode;

use App\Attributes\Entry;
use App\Enums\Accounts\CommandEntry;
use App\Support\Command;
use App\Values\SignInPoll;

/**
 * The host's runner asks, in the generation it runs in, whether its attempt is still live, and takes the code the
 * user typed, once; an ended attempt forgets its code and challenge. Run for
 * an authenticated host by the journal itself (internal, not exported).
 *
 * @extends Command<SignInPoll>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class TakeSignInCodeCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $attemptId,
        public int $generation,
    ) {}
}
