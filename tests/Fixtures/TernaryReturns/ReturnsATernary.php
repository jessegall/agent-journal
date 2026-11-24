<?php

declare(strict_types=1);

namespace Tests\Fixtures\TernaryReturns;

/**
 * A choice returned as a ternary, which the ternary returns scan lists.
 */
final readonly class ReturnsATernary
{
    public function state(bool $isOn): string
    {
        return $isOn ? 'on' : 'off';
    }
}
