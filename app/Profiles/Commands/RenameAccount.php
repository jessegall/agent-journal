<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner gives a saved account a new name; past starts show the new name too.
 *
 * @extends Command<null>
 */
#[Authorize(AccountPolicy::class, AccessType::Edit)]
final readonly class RenameAccount extends Command
{
    public function __construct(
        public string $accountId,
        public string $label,
    ) {}
}
