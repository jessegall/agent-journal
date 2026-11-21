<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner types the code the provider's page showed, or gives the key or token of a secret method, into a live
 * sign-in; the host's runner hands it to the program once, and a repeat under the same request key changes nothing. Neither is stored with the attempt; a secret leaves only
 * its keyed fingerprint.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class SubmitSignInCode extends Command
{
    public function __construct(
        public string $attemptId,
        public string $code,
        public string $submissionKey,
    ) {}
}
