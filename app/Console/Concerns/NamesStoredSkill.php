<?php

declare(strict_types=1);

namespace App\Console\Concerns;

/**
 * A skill command that names its stored skill by the number or key in its number argument.
 */
trait NamesStoredSkill
{
    private function skillNumber(): string
    {
        return (string) $this->argument('number');
    }
}
