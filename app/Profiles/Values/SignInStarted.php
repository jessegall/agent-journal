<?php

declare(strict_types=1);

namespace App\Profiles\Values;

/**
 * The attempt a start began or rejoined: a second start while one signs in rejoins it instead of starting another.
 */
final readonly class SignInStarted
{
    public function __construct(
        public string $attemptId,
        public bool $didRejoin,
    ) {}
}
