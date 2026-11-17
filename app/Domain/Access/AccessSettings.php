<?php

declare(strict_types=1);

namespace App\Domain\Access;

/**
 * The access settings of config/access.php, read once: the id of the one person who owns this journal, or none.
 */
final readonly class AccessSettings
{
    public function __construct(public ?int $ownerId) {}
}
