<?php

declare(strict_types=1);

namespace App\Values;

use App\Contracts\FactOrigin;

/**
 * A fact given by a declared command rule, at the revision that was in force.
 */
final readonly class RuleOrigin implements FactOrigin
{
    public function __construct(public string $rule, public int $revision) {}

    public function reference(): string
    {
        return "rule:{$this->rule}@{$this->revision}";
    }
}
