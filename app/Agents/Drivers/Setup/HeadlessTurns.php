<?php

declare(strict_types=1);

namespace App\Agents\Drivers\Setup;

use App\Agents\Drivers\Contracts\TurnResults;

/**
 * How a driver runs its headless turns: each in a process of its own, whose output a turn result reads.
 */
final readonly class HeadlessTurns
{
    /**
     * @param  class-string<TurnResults>  $turnResults
     */
    private function __construct(private string $turnResults) {}

    /**
     * @param  class-string<TurnResults>  $results
     */
    public static function eachInAProcess(string $results): self
    {
        return new self($results);
    }

    /**
     * @return class-string<TurnResults>
     */
    public function turnResults(): string
    {
        return $this->turnResults;
    }
}
