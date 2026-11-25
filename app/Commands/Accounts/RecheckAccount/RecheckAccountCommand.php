<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RecheckAccount;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AccountPolicy;
use App\Support\Command;

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
