<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Accounts\AccountNoticeCause;
use App\Contracts\Events\ListenerFailureLog;
use App\Contracts\Navigation\UserInterfaceUpdater;
use App\Enums\AccountNoticeReason;
use App\Enums\StartUnavailableReason;

/**
 * A start of an agent was refused because no account could run its driver; it names the driver and a safe
 * reason, never an account.
 */
final readonly class StartUnavailable extends SessionEvent implements AccountNoticeCause, ListenerFailureLog, UserInterfaceUpdater
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
