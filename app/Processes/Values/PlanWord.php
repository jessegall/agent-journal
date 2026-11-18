<?php

declare(strict_types=1);

namespace App\Processes\Values;

/**
 * One argument of a planned command as its pieces in order: literal text, or the output of a substitution step named
 * by its syntax node. It is never shell text to be read again.
 */
final readonly class PlanWord
{
    /**
     * @param  list<string|int>  $pieces  literal text, or the syntax node id of a substitution whose output goes here
     */
    public function __construct(public array $pieces) {}

    /**
     * The word's text when it holds no substitution.
     */
    public function literal(): string|null
    {
        return array_any($this->pieces, fn (string|int $piece): bool => is_int($piece)) ? null : implode('', $this->pieces);
    }

    /**
     * @return list<string|int>
     */
    public function toArray(): array
    {
        return $this->pieces;
    }

    /**
     * @param  list<string|int>  $pieces
     */
    public static function fromArray(array $pieces): self
    {
        return new self($pieces);
    }
}
