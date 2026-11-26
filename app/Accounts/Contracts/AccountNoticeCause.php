<?php

declare(strict_types=1);

namespace App\Accounts\Contracts;

use App\Accounts\Enums\AccountNoticeReason;
use App\Contracts\Events\Event;

/**
 * Something that went wrong for a driver that may leave a notice on its account: a start refused, or a failure.
 */
interface AccountNoticeCause extends Event
{
    public string $agentId { get; }

    public string $driver { get; }

    /**
     * The notice it leaves, or none when the owner need not act on it.
     */
    public function noticeReason(): AccountNoticeReason|null;
}
