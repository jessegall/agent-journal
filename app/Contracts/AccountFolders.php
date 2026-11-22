<?php

declare(strict_types=1);

namespace App\Contracts;

/**
 * Makes and removes an account's own sign-in folder: the sign-in service itself on the protected host, the agent
 * host as root where agents run in containers and the accounts root is root's.
 */
interface AccountFolders
{
    /**
     * Makes the folder, private to the driver's user; an existing folder is left as it is.
     */
    public function make(string $directory): void;

    /**
     * Removes the folder and everything in it, or a link in its place without following it.
     */
    public function remove(string $directory): void;
}
