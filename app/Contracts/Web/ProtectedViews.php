<?php

declare(strict_types=1);

namespace App\Contracts\Web;

/**
 * The users' open pages that show protected content: a part that took something away tells them to read again.
 */
interface ProtectedViews
{
    /**
     * Tells each user's open pages to drop what they show and read again; the signal itself carries no content.
     *
     * @param  list<string>  $userIds
     */
    public function invalidateFor(array $userIds): void;
}
