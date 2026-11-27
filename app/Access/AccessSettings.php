<?php

declare(strict_types=1);

namespace App\Access;

/**
 * The access settings of config/journal.php (access), read once: the id of the one user who owns this journal, or none.
 */
final readonly class AccessSettings
{
    public function __construct(public string|null $ownerId) {}
}
