<?php

declare(strict_types=1);

namespace App\Contracts\Chat;

use App\Data\NotificationLink;

/**
 * Answers, for the signed-in actor, what one type of notification target shows: its title and address while the
 * actor may still see it, and whether a target the actor cannot see may still be named as unavailable.
 */
interface NotificationTargetResolver
{
    /**
     * The links of the targets the reader may still see, by target id, read together; a target left out has none.
     * A numeric target id keys the array as PHP keys it, an integer.
     *
     * @param  list<string>  $targetIds
     * @return array<int|string, NotificationLink>
     */
    public function linksFor(array $targetIds): array;

    /**
     * Whether a target this resolver finds no link for may show as a generic unavailable entry; when not, the
     * receipt is left out.
     */
    public function disclosesMissing(): bool;
}
