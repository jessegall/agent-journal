<?php

declare(strict_types=1);

namespace App\Profiles\Commands\RecheckAccount;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner asks the host to check a held account again after its last check could not tell whether it still signs
 * in; starts stay blocked until a check gives an answer.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class RecheckAccountCommand extends Command
{
    public function __construct(public string $accountId) {}
}
