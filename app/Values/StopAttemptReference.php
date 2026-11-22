<?php

declare(strict_types=1);

namespace App\Values;

/**
 * An opaque reference to one stop attempt, the only way another area names it: it carries no session field.
 */
final readonly class StopAttemptReference
{
    public function __construct(public string $attemptId) {}
}
