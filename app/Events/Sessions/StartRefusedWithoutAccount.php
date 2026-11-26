<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Accounts\Contracts\AccountNoticeCause;
use App\Accounts\Enums\AccountNoticeReason;
use App\Navigation\Contracts\ClientUpdate;
use App\Sessions\Contracts\Events\ListenerFailureLog;
use App\Sessions\Enums\StartUnavailableReason;

/**
 * A start of an agent was refused because no account could run its driver; it names the driver and a safe
 * reason, never an account.
 */
final readonly class StartRefusedWithoutAccount implements AccountNoticeCause, ClientUpdate, ListenerFailureLog, SessionEvent
{
    public function __construct(
        public string $agentId,
        public string $driver,
        public StartUnavailableReason $reason,
    ) {}

    public function noticeReason(): AccountNoticeReason|null
    {
        return AccountNoticeReason::forStart($this->reason);
    }
}
