<?php

declare(strict_types=1);

namespace App\Profiles\Commands\CompleteSignIn;

use App\Bus\Attributes\Entry;
use App\Bus\Enums\CommandEntry;
use App\Bus\Support\Command;
use App\Profiles\Values\SignInIdentity;

/**
 * The host reports a sign-in it verified outside any transaction, in the generation it ran in; the result is saved
 * once, and only while the attempt is live, within its deadline and in that generation. Run for an authenticated host
 * by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class CompleteSignInCommand extends Command
{
    public function __construct(
        public string $attemptId,
        public int $generation,
        public SignInIdentity $identity,
    ) {}
}
