<?php

declare(strict_types=1);

namespace App\Contracts\Accounts;

use App\Contracts\Events\Event;

/**
 * A Profiles row fact the owner's Accounts page shows: the driver it belongs to and the account, attempt or notice
 * the page refreshes for.
 */
interface ShownOnAccounts extends Event
{
    public string $driver { get; }

    /**
     * The driver whose accounts page shows the fact.
     */
    public function driver(): string;

    /**
     * The id of the account or sign-in the fact is about.
     */
    public function subjectId(): string;
}
