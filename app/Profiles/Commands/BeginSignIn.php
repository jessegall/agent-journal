<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Enums\SignInMethod;
use App\Profiles\Handlers\BeginSignInHandler;
use App\Profiles\Policies\AccountPolicy;
use App\Profiles\Values\SignInStarted;

/**
 * The owner starts signing in a new account of a program, named once it proves who it is; a saved account is signed
 * in again with BeginSignInAgain. A repeat of the same request, or a second start while one runs, rejoins the attempt running.
 *
 * @extends Command<SignInStarted>
 */
#[HandledBy(BeginSignInHandler::class)]
#[Authorize(AccountPolicy::class, AccessType::Create)]
final readonly class BeginSignIn extends Command
{
    public function __construct(
        public string $driver,
        public SignInMethod $method,
        public string $requestKey,
    ) {}
}
