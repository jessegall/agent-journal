<?php

declare(strict_types=1);

namespace App\Communication\Contracts;

use App\Communication\Data\NotificationLink;
use PhpOption\Option;

/**
 * Answers, for the signed-in actor, what one type of notification target shows: its title and address while the
 * actor may still see it, and whether a target the actor cannot see may still be named as unavailable.
 */
interface NotificationTargetResolver
{
    /**
     * @return Option<NotificationLink>
     */
    public function linkFor(string $targetId): Option;

    /**
     * Whether a target this resolver finds no link for may show as a generic unavailable entry; when not, the
     * receipt is left out.
     */
    public function disclosesMissing(): bool;
}
