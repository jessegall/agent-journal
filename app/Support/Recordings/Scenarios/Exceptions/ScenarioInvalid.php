<?php

declare(strict_types=1);

namespace App\Support\Recordings\Scenarios\Exceptions;

use RuntimeException;
use Throwable;

/**
 * A scenario file that cannot be played, refused whole before any of its steps runs.
 */
final class ScenarioInvalid extends RuntimeException
{
    public static function at(string $scenario, int $step, string $problem, Throwable|null $cause = null): self
    {
        $place = $step + 1;

        return new self("The scenario {$scenario} cannot be played: step {$place} {$problem}.", 0, $cause);
    }

    public static function unreadable(string $scenario, Throwable $cause): self
    {
        return new self("The scenario {$scenario} cannot be read: {$cause->getMessage()}.", 0, $cause);
    }
}
