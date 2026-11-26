<?php

declare(strict_types=1);

namespace App\Events\Accounts;

use App\Accounts\Contracts\AccountNoticeEvent;
use App\Accounts\Contracts\ShownOnAccounts;

/**
 * A notice on the driver's accounts was recorded, or counted again.
 */
final readonly class AccountNoticeRecorded implements AccountEvent, AccountNoticeEvent, ShownOnAccounts
{
    public function __construct(public string $driver, public string $noticeId) {}

    public function driver(): string
    {
        return $this->driver;
    }

    public function subjectId(): string
    {
        return $this->noticeId;
    }
}
