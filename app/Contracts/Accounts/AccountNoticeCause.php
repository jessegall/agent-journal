<?php

declare(strict_types=1);

namespace App\Contracts\Accounts;

use App\Contracts\Events\Event;
use App\Enums\AccountNoticeReason;

/**
 * Something that went wrong for a driver that may leave a notice on its account: a start refused, or a failure.
 */
interface AccountNoticeCause extends Event
{
    public string $driver { get; }

    /**
     * The notice it leaves, or none when the owner need not act on it.
     */
    public function noticeReason(): AccountNoticeReason|null;
}
