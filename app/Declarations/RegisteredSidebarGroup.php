<?php

declare(strict_types=1);

namespace App\Declarations;

/**
 * A checked sidebar group of an installed domain: its full key and the label its owner gives it.
 */
final readonly class RegisteredSidebarGroup
{
    private function __construct(public DomainUi $owner, public string $key, public string $label) {}

    public static function of(DomainUi $owner, SidebarGroup $group): self
    {
        return new self($owner, $owner->fullKey('sidebar group', $group->key), $group->label);
    }
}
