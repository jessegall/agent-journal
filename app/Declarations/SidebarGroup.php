<?php

declare(strict_types=1);

namespace App\Declarations;

/**
 * A sidebar group a domain owns, keyed within that domain: its label heads the root items of any domain that name its
 * full key, such as web.agents.
 */
final readonly class SidebarGroup
{
    private function __construct(public string $key, public string $label) {}

    public static function make(string $key, string $label): self
    {
        return new self($key, $label);
    }
}
