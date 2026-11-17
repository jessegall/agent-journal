<?php

declare(strict_types=1);

namespace App\Domain\Access\Support;

/**
 * The access settings of config/access.php, read once: the id of the one user who owns this journal, or none.
 */
final readonly class AccessSettings
{
    public function __construct(public int|null $ownerId) {}
}
