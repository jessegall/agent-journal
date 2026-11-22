<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * A Profiles row fact the owner's Accounts page shows: the driver it belongs to and the account, attempt or notice
 * the page refreshes for.
 */
interface ShownOnAccounts extends Event
{
    public function driver(): string;

    public function subjectId(): string;
}
