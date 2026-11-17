<?php

declare(strict_types=1);

namespace App\Domain\Access\Api;

/**
 * The signed-in user as a page may show them: their id and display name, never a credential.
 */
final readonly class Viewer
{
    public function __construct(
        public int $id,
        public string $name,
    ) {}
}
