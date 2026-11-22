<?php

declare(strict_types=1);

namespace App\Declarations;

/**
 * A checked menu of an installed domain: its full key, its label and the route parameter its record fills.
 */
final readonly class RegisteredMenu
{
    private function __construct(
        public DomainUi $owner,
        public string $key,
        public string $label,
        public string|null $recordParameter,
    ) {}

    public static function of(DomainUi $owner, Menu $menu): self
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
        return $this->recordParameter === null ? [] : [$this->recordParameter];
    }
}
