<?php

declare(strict_types=1);

namespace App\Processes\Values;

use Spatie\LaravelData\Data;

/**
 * One argument of a planned command as its pieces in order: literal text, or the output of a substitution step named
 * by its syntax node. It is never shell text to be read again.
 */
final class PlanWord extends Data
{
    /**
     * @param  list<string|int>  $pieces  literal text, or the syntax node id of a substitution whose output goes here
     */
    public function __construct(public readonly array $pieces) {}

    /**
     * The word's text when it holds no substitution.
     */
    public function literal(): string|null
    {
        $substituted = array_any($this->pieces, fn (string|int $piece): bool => is_int($piece));

        return $substituted ? null : implode('', $this->pieces);
    }
}
