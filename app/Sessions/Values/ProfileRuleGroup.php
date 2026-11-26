<?php

declare(strict_types=1);

namespace App\Sessions\Values;

/**
 * A named group of the rules a profile works under; a group read with no rules in it holds none.
 */
final readonly class ProfileRuleGroup
{
    /**
     * @param  list<ProfileRule>  $rules
     */
    public function __construct(
        public string $label,
        public array $rules,
    ) {}
}
