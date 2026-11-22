<?php

declare(strict_types=1);

namespace App\Support;

use App\Declarations\ToggleGroup;
use PhpOption\Option;

/**
 * The Core settings group that switches each domain on or off, by domain name; a domain that can never be switched
 * off has none. These are the exact groups Core registers, so reads and commands find them.
 */
final readonly class DomainSwitches
{
    /**
     * @param  array<string, ToggleGroup>  $groups  by domain name
     */
    public function __construct(private array $groups) {}

    /**
     * @return Option<ToggleGroup>
     */
    public function of(string $domainName): Option
    {
        return Option::fromArraysValue($this->groups, $domainName);
    }

    /**
     * @return list<ToggleGroup>
     */
    public function groups(): array
    {
        return array_values($this->groups);
    }
}
