<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Navigation\ClientUpdate;
use App\Support\RecordIdentity;

/**
 * The starts using an account changed: held, cancelled or settled for its maintenance. It names the account by
 * identity alone, once the change has committed.
 */
final readonly class AccountUseChanged implements ClientUpdate, SessionEvent
{
    public function __construct(public RecordIdentity $account) {}
}
