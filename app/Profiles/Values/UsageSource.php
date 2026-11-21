<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use Carbon\CarbonImmutable;

/**
 * Where and when a usage reading was observed: the source that made it, its place in that source's order and the
 * UTC time, to the second, it was seen. Of two readings the later time wins, then the higher order, then the source.
 */
final readonly class UsageSource
{
    public CarbonImmutable $observedAt;

    public function __construct(public string $id, public int $order, CarbonImmutable $observedAt)
    {
        $this->observedAt = $observedAt->utc()->startOfSecond();
    }

    public function isNewerThan(self $other): bool
    {
        if (! $this->observedAt->equalTo($other->observedAt)) {
            return $this->observedAt->greaterThan($other->observedAt);
        }

        if ($this->order !== $other->order) {
            return $this->order > $other->order;
        }

        return strcmp($this->id, $other->id) > 0;
    }
}
