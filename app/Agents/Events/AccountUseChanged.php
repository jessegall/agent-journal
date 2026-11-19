<?php

declare(strict_types=1);

namespace App\Agents\Events;

use App\Contracts\Event;
use App\Records\Support\RecordIdentity;
use App\Ui\Contracts\UpdatesUserInterface;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The starts using an account changed: held, cancelled or settled for its maintenance. It names the account by
 * identity alone, once the change has committed.
 */
final readonly class AccountUseChanged implements Event, ShouldDispatchAfterCommit, UpdatesUserInterface
{
    public function __construct(public RecordIdentity $account) {}
}
