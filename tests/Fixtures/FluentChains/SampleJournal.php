<?php

declare(strict_types=1);

namespace Tests\Fixtures\FluentChains;

/**
 * A careless journal the fluent chain check is proven on: a flattened verb and a call that switches the chain.
 */
final class SampleJournal
{
    public function seed(): self
    {
        return $this;
    }

    public function releaseTurnsOnTestHost(): self
    {
        return $this;
    }

    public function sampleHost(): SampleHost
    {
        return new SampleHost();
    }
}
