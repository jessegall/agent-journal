<?php

declare(strict_types=1);

namespace App\Accounts\Contracts;

use App\Contracts\Events\Event;

/**
 * A notice on an account recorded or resolved.
 */
interface AccountNoticeEvent extends Event
{
    public string $driver { get; }

    public string $noticeId { get; }
}
