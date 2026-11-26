<?php

declare(strict_types=1);

namespace App\Accounts\Contracts;

/**
 * Ends, with proof, everything that runs on a saved account on this host before its sign-in is replaced or removed.
 */
interface AccountFolderUses
{
    /**
     * Whether nothing uses an account's displaced folder any more, so it may be signed out and deleted: on a contained
     * host no container binds it, since a running session keeps its folder to its end; locally the journal ended every
     * process of the account before it handed out the sign-in.
     */
    public function isDisplacedFolderFree(string $directory, string $accountId): bool;
}
