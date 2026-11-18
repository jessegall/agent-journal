<?php

declare(strict_types=1);

namespace Domain\Documents\Console\Support;

/**
 * How long one read took over many runs, and the queries one run cost.
 */
final readonly class ReadTiming
{
    public function __construct(public float $p50, public float $p95, public int $queries) {}

    /**
     * @param  list<float>  $milliseconds  the time of each run
     */
    public static function of(array $milliseconds, int $queries): self
    {
        sort($milliseconds);
        $highest = count($milliseconds) - 1;

        return new self($milliseconds[intdiv($highest, 2)], $milliseconds[max(0, (int) ceil(count($milliseconds) * 0.95) - 1)], $queries);
    }
}
