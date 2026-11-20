<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Handlers\SubmitSignInCodeHandler;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner types the code the provider's page showed, or gives the key or token of a secret method, into a live
 * sign-in; the host's runner hands it to the program once. Neither is stored with the attempt; a secret leaves only
 * its keyed fingerprint.
 *
 * @extends Command<null>
 */
#[HandledBy(SubmitSignInCodeHandler::class)]
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class SubmitSignInCode extends Command
{
    public function __construct(
        public string $attemptId,
        public string $code,
    ) {}
}
