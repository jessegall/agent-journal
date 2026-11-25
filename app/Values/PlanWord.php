<?php

declare(strict_types=1);

namespace App\Values;

use Spatie\LaravelData\Data;

/**
 * One argument of a planned command as its pieces in order: literal text, or the output of a substitution step named
 * by its syntax node. It is never shell text to be read again.
 */
final class PlanWord extends Data
{
    /**
     * The Data cast reads @param and would turn every piece of a string|int union into an int, so it is given a list
     * it leaves alone; @phpstan-param keeps the real type.
     *
     * @param  list<mixed>  $pieces  literal text, or the syntax node id of a substitution whose output goes here
     *
     * @phpstan-param  list<string|int>  $pieces
     */
    public function __construct(public readonly array $pieces) {}

    /**
     * The word's text when it holds no substitution.
     */
    public function literal(): string|null
    {
        $substituted = array_any($this->pieces, fn (string|int $piece) => is_int($piece));

        if ($substituted) {
            return null;
        }

        return implode('', $this->pieces);
    }

    /**
     * The word's text with each substitution's output put in its place.
     *
     * @param  array<int, string>  $substitutionOutputs  each substitution's output by its syntax node id
     */
    public function textWith(array $substitutionOutputs): string
    {
        return implode('', array_map(
            fn (string|int $piece) => is_int($piece) ? $substitutionOutputs[$piece] : $piece,
            $this->pieces,
        ));
    }
}
