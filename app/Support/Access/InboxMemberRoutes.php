<?php

declare(strict_types=1);

namespace App\Support\Access;

use App\Contracts\Inboxes\InboxMemberRoutes as InboxMemberRoutesContract;

/**
 * The route name prefixes opened to inbox members, as the parts that own those routes added them.
 */
final class InboxMemberRoutes implements InboxMemberRoutesContract
{
    /**
     * @var list<string>
     */
    private array $namePrefixes = [];

    public function open(string $namePrefix): void
    {
        $this->namePrefixes[] = $namePrefix;
    }

    public function admits(string $routeName): bool
    {
        return array_any($this->namePrefixes, fn (string $prefix) => str_starts_with($routeName, $prefix));
    }
}
