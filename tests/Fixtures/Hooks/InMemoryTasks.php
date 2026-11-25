<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks;

/**
 * The started tasks a hook test pretends exist, by number; a test finishes one in place.
 */
final class InMemoryTasks
{
    /**
     * @param  list<int>  $started
     */
    public function __construct(private array $started = []) {}

    public function finish(int $number): void
    {
        $this->started = array_values(array_diff($this->started, [$number]));
    }

    public function isStarted(int $number): bool
    {
        return in_array($number, $this->started, true);
    }
}
