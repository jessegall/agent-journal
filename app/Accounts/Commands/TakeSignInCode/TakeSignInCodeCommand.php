<?php

declare(strict_types=1);

namespace App\Accounts\Commands\TakeSignInCode;

use App\Accounts\Enums\CommandEntry;
use App\Accounts\Values\SignInPoll;
use App\Attributes\Commands\Entry;
use App\Support\Command;

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
