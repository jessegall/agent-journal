<?php

declare(strict_types=1);

namespace App\Profiles\Contracts;

/**
 * Ends, with proof, everything that runs on a saved account on this host before its sign-in is replaced or removed.
 */
interface AccountOwnerDrain
{
    /**
     * Whether nothing of the account runs any more; false keeps the account's sign-in unchanged for now. A new
     * account's fresh folder has no id and nothing that runs on it.
     */
    public function drain(string $directory, string|null $accountId): bool;
}
