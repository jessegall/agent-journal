<?php

declare(strict_types=1);

namespace App\Profiles\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;
use App\Profiles\Enums\AccountAbility;
use App\Profiles\Handlers\DismissAccountNoticeHandler;
use App\Profiles\Models\Account;
use App\Profiles\Policies\AccountPolicy;

/**
 * The owner dismisses a notice about a program's accounts; dismissing it again changes nothing.
 *
 * @extends Command<null>
 */
#[HandledBy(DismissAccountNoticeHandler::class)]
#[Authorize(AccountPolicy::class, AccountAbility::Manage)]
final readonly class DismissAccountNotice extends Command implements HasAuthorizationSubject
{
    public function __construct(public string $noticeId) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Account::class;
    }
}
