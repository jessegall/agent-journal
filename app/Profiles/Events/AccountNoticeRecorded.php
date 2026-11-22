<?php

declare(strict_types=1);

namespace App\Profiles\Events;

use App\Profiles\Contracts\ShownOnAccounts;

/**
 * A notice on the driver's accounts was recorded, or counted again.
 */
final readonly class AccountNoticeRecorded implements ShownOnAccounts
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
