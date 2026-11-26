<?php

declare(strict_types=1);

namespace App\Accounts\Commands\NotifySignIn;

use App\Accounts\Enums\CommandEntry;
use App\Accounts\Enums\SignInOutcome;
use App\Attributes\Commands\Entry;
use App\Support\Command;
use App\Values\SignInIdentity;

/**
 * The host's sign-in runner reports a safe outcome of the attempt it runs, in the generation it ran in: waiting for
 * the user, verified by the driver's own check outside any transaction, or failed, with the provider's reason when
 * it refused the proof. Run for an authenticated host
 * by the journal itself (internal, not exported).
 *
 * @extends Command<null>
 */
#[Entry(CommandEntry::HostControl)]
final readonly class NotifySignInCommand extends Command
{
    public function __construct(
        public string $hostId,
        public string $attemptId,
        public int $generation,
        public SignInOutcome $outcome,
        public SignInIdentity $identity,
        public string|null $refusal = null,
    ) {}
}
