<?php

declare(strict_types=1);

namespace App\Profiles\Events;

use App\Profiles\Contracts\ShownOnAccounts;

/**
 * A notice on the program's accounts was resolved.
 */
final readonly class AccountNoticeResolved implements ShownOnAccounts
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
