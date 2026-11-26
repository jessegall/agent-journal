<?php

declare(strict_types=1);

namespace App\Connections\Values;

/**
 * One task of an environment as a terminal's overview names it: its number and title.
 */
final readonly class EnvironmentTask
{
    public function __construct(public int $number, public string $title) {}
}
