<?php

declare(strict_types=1);

namespace App\Support;

/**
 * The profile key a start asks for, as Agents knows it: a scalar the agent row pins, never Profiles' own key type.
 */
final readonly class StartProfileKey
{
    public function __construct(public string $key) {}
}
