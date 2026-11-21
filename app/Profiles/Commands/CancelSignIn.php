<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner cancels a sign-in; the attempt ends before its process is stopped, so a late result changes nothing.
 * Cancelling an ended attempt changes nothing.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class CancelSignIn extends Command
{
    public function __construct(public string $attemptId) {}
}
