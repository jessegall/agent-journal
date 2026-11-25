<?php

declare(strict_types=1);

namespace Tests\Fixtures\ArrayWrites;

/**
 * A value class built from an array, which is no row and passes.
 */
final readonly class TicketLabel
{
    /**
     * @param  list<string>  $words
     */
    private function __construct(public array $words) {}

    public static function of(string $text): self
    {
        return new self([$text]);
    }
}
