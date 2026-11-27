<?php

declare(strict_types=1);

namespace Tests\Fixtures\FluentChains;

/**
 * An inner subject of the careless journal, fluent itself.
 */
final class SampleHost
{
    public function holdTurns(): self
    {
        return $this;
    }
}
