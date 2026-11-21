<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;
use App\Profiles\Values\SignInStarted;

/**
 * The owner confirms signing a saved account in again: no new start uses the account from then on, and the host
 * starts the program's sign-in once every process on its folder has ended. A repeat of the same request, or a second
 * start from another tab, rejoins the attempt already running.
 *
 * @extends Command<SignInStarted>
 */
#[Authorize(AccountPolicy::class, AccessType::Create)]
final readonly class BeginSignInAgain extends Command
{
    public function __construct(
        public string $accountId,
        public string $requestKey,
    ) {}
}
