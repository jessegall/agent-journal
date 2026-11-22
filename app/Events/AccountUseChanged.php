<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use App\Contracts\UserInterfaceUpdater;
use App\Support\RecordIdentity;

/**
 * The starts using an account changed: held, cancelled or settled for its maintenance. It names the account by
 * identity alone, once the change has committed.
 */
final readonly class AccountUseChanged implements Event, UserInterfaceUpdater
{
    public function __construct(public RecordIdentity $account) {}
}
