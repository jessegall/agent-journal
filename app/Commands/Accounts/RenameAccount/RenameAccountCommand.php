<?php

declare(strict_types=1);

namespace App\Commands\Accounts\RenameAccount;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AccountPolicy;
use App\Support\Command;

/**
 * The owner gives a saved account a new name, against the name revision the page showed when it sends one; past
 * starts show the new name too.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class RenameAccountCommand extends Command
{
    public function __construct(
        public string $accountId,
        public string $label,
        public int|null $seenRevision = null,
    ) {}
}
