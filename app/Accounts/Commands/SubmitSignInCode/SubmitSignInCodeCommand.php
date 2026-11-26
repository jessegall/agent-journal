<?php

declare(strict_types=1);

namespace App\Accounts\Commands\SubmitSignInCode;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AccountPolicy;
use App\Support\Command;

/**
 * The owner types the code the provider's page showed, or gives the key or token of a secret method, into a live
 * sign-in; the host's runner hands it to the driver once, and a repeat under the same request key changes nothing. Neither is stored with the attempt; a secret leaves only
 * its keyed fingerprint.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class SubmitSignInCodeCommand extends Command
{
    public function __construct(
        public string $attemptId,
        public string $code,
        public string $submissionKey,
    ) {}
}
