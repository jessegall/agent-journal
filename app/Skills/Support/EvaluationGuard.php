<?php

declare(strict_types=1);

namespace App\Skills\Support;

use Closure;

/**
 * Marks the stretch of a request in which a skill condition evaluates, so the bus can refuse any command run inside it.
 */
final class EvaluationGuard
{
    private int $depth = 0;

    /**
     * @template T
     *
     * @param  Closure(): T  $evaluation
     * @return T
     */
    public function during(Closure $evaluation): mixed
    {
        $this->depth++;

        try {
            return $evaluation();
        } finally {
            $this->depth--;
        }
    }

    public function isEvaluating(): bool
    {
        return $this->depth > 0;
    }
}
