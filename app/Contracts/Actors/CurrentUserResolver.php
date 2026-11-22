<?php

declare(strict_types=1);

namespace App\Contracts\Actors;

use App\Support\CurrentUser;
use PhpOption\Option;

/**
 * The user signed in to this request's session, as a page may show them, or none for a guest such as the sign-in page.
 * Core owns it; Access fills it.
 */
interface CurrentUserResolver
{
    /**
     * @return Option<CurrentUser>
     */
    public function currentUser(): Option;
}
