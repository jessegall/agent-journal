<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Accounts\Contracts\AccountNoticeCause;
use App\Accounts\Enums\AccountNoticeReason;
use App\Agents\Drivers\Enums\DriverFailure;
use App\Navigation\Contracts\ClientUpdate;
use App\Sessions\Contracts\Events\ListenerFailureLog;
use App\Support\RecordIdentity;

/**
 * A start's driver reported that a request failed, and why in its checked vocabulary, with the account by identity
 * and the sign-in generation its start ran in when it ran on one; the driver's own error text stays private.
 */
final readonly class DriverFailed implements AccountNoticeCause, ClientUpdate, ListenerFailureLog, SessionEvent
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $driver,
        public DriverFailure $failure,
        public RecordIdentity|null $account = null,
        public int|null $accountGeneration = null,
    ) {}

    public function noticeReason(): AccountNoticeReason|null
    {
        return AccountNoticeReason::forFailure($this->failure);
    }
}
