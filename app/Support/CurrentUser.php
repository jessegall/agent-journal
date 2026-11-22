<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The signed-in user as a page may show them: their id and display name, never a credential.
 */
final readonly class CurrentUser
{
    public function __construct(
        public string $id,
        public string $name,
    ) {}
}
