<?php

declare(strict_types=1);

namespace App\Skills\Values;

/** The number or key a caller uses to name a stored skill. */
final readonly class SkillReference
{
    public function __construct(public string $numberOrKey) {}
}
