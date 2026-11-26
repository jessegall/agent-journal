<?php

declare(strict_types=1);

namespace App\Navigation\Contracts;

/**
 * The pages the domains declared, by key: whether one is declared, and the address it is served at with arguments.
 */
interface DeclaredPages
{
    /**
     * Whether a page of that name is declared.
     */
    public function declares(string $page): bool;

    /**
     * @param  array<string, string>  $arguments
     */
    public function addressOf(string $page, array $arguments): string;
}
