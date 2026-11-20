<?php

declare(strict_types=1);

namespace Tests\Fixtures\ThrowOnlyGuards;

use RuntimeException;

/**
 * A gate with one guard named as a requirement, one named as an assertion and one check that answers.
 */
final class Gate
{
    public bool $isStarted = false;

    public function requireStarted(): void
    {
        if (! $this->isStarted) {
            throw new RuntimeException('not started');
        }
    }

    public function assertStarted(): void
    {
        if (! $this->isStarted) {
            throw new RuntimeException('not started');
        }
    }

    public function checkStarted(): bool
    {
        return $this->isStarted;
    }

    public function ensureStarted(): void
    {
        $this->isStarted = true;
    }
}
