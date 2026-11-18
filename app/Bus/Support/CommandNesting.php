<?php

declare(strict_types=1);

namespace App\Bus\Support;

use App\Bus\Exceptions\CommandNestingTooDeep;
use Illuminate\Container\Attributes\Scoped;

/**
 * How deep commands dispatched from handlers are nested in this request; eight levels at most.
 */
#[Scoped]
final class CommandNesting
{
    private const int LIMIT = 8;

    private int $depth = 0;

    public function enter(): void
    {
        if ($this->depth >= self::LIMIT) {
            throw CommandNestingTooDeep::at($this->depth + 1);
        }

        $this->depth++;
    }

    public function leave(): void
    {
        $this->depth--;
    }
}
