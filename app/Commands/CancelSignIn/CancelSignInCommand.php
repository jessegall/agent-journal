<?php

declare(strict_types=1);

namespace App\Commands\CancelSignIn;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AccountPolicy;
use App\Support\Command;

/**
 * The owner cancels a sign-in; the attempt ends before its process is stopped, so a late result changes nothing.
 * Cancelling an ended attempt changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class CancelSignInCommand extends Command
{
    public function __construct(public string $attemptId) {}
}
