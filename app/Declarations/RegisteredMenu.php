<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Navigation\Declarations\DomainClient;
use App\Navigation\Declarations\Menu;

/**
 * A checked menu of an installed domain: its full key, its label and the route parameter its record fills.
 */
final readonly class RegisteredMenu
{
    private function __construct(
        public DomainClient $owner,
        public string $key,
        public string $label,
        public string|null $recordParameter,
    ) {}

    public static function of(DomainClient $owner, Menu $menu): self
    {
        return new self($owner, $owner->fullKey('menu', $menu->key), $menu->label, $menu->recordParameter);
    }

    /**
     * The route parameters an item of this menu must take: the record's, or none.
     *
     * @return list<string>
     */
    public function parameters(): array
    {
        if ($this->recordParameter === null) {
            return [];
        }

        return [$this->recordParameter];
    }
}
