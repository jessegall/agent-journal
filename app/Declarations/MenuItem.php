<?php

declare(strict_types=1);

namespace App\Declarations;

use App\Contracts\VisibilityCheck;
use App\Enums\Icon;

/**
 * An item a domain puts in a menu, keyed within that domain: it opens a page of its own domain or sends one of its own
 * actions, bound to the menu's record, and sits in a group of the menu, ordered by position then full key. Each change
 * returns a new item.
 */
final readonly class MenuItem
{
    /**
     * @param  string  $menu  the full key of the menu it joins, such as documents.document-actions
     * @param  string|null  $page  the key of a page of its domain it opens, or null when it sends an action
     * @param  string|null  $action  the name of an action of its domain it sends, or null when it opens a page
     * @param  array<string, string>  $query
     * @param  class-string<VisibilityCheck>|null  $visibility  null when everyone who may use its target sees it
     */
    private function __construct(
        public string $key,
        public string $label,
        public string $menu,
        public string|null $page,
        public string|null $action,
        public array $query = [],
        public string $group = 'main',
        public int $position = 0,
        public Icon|null $icon = null,
        public string|null $visibility = null,
    ) {}

    /**
     * An item that opens a page of its domain on the menu's record, with these query values.
     *
     * @param  array<string, string>  $query
     */
    public static function opens(string $key, string $label, string $menu, string $page, array $query = []): self
    {
        return new self($key, $label, $menu, $page, null, $query);
    }

    /**
     * An item that sends an action of its domain for the menu's record.
     */
    public static function sends(string $key, string $label, string $menu, string $action): self
    {
        return new self($key, $label, $menu, null, $action);
    }

    /**
     * The item in this group of its menu, at this position within it.
     */
    public function inGroup(string $group, int $position = 0): self
    {
        return clone ($this, ['group' => $group, 'position' => $position]);
    }

    public function withIcon(Icon $icon): self
    {
        return clone ($this, ['icon' => $icon]);
    }

    /**
     * @param  class-string<VisibilityCheck>  $check
     */
    public function visibleWhen(string $check): self
    {
        return clone ($this, ['visibility' => $check]);
    }
}
