<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Enums\AccountAbility;
use App\Profiles\Handlers\CancelSignInHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner cancels a sign-in; the attempt ends before its process is stopped, so a late result changes nothing.
 * Cancelling an ended attempt changes nothing.
 *
 * @extends Command<null>
 */
#[HandledBy(CancelSignInHandler::class)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
#[Operation('cancel_sign_in', ResourceAreaType::JournalControl, AccessType::Edit)]
final readonly class CancelSignIn extends Command implements AuthorizedCommand
{
    public function __construct(public string $attemptId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Account::class;
    }
}
