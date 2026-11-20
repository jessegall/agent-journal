<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * The profile key a launch asks for, as Agents knows it: a scalar the agent row pins, never Profiles' own key type.
 */
final readonly class LaunchProfileKey
{
    public function __construct(public string $key) {}
}
