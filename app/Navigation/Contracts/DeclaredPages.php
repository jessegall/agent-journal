<?php

declare(strict_types=1);

namespace App\Navigation\Contracts;

use App\Web\Declarations\RegisteredPage;
use PhpOption\Option;

/**
 * The pages the domains declared, by key: whether one is declared, the page itself, and the address it is served at
 * with arguments.
 */
interface DeclaredPages
{
    /**
     * Whether a page of that name is declared.
     */
    public function declares(string $page): bool;

    /**
     * The address the page is served at with these arguments.
     *
     * @param  array<string, string>  $arguments
     */
    public function addressOf(string $page, array $arguments): string;

    /**
     * The page with the given full key, when one is declared; for a key that comes from a request.
     *
     * @return Option<RegisteredPage>
     */
    public function pageOrNone(string $key): Option;
}
