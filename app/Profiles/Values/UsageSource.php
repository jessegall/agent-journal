<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use Carbon\CarbonImmutable;

/**
 * Where and when a usage reading was observed: the source that made it, its place in that source's order and the
 * Unix second it was seen. Of two readings the later second wins, then the higher order, then the source.
 */
final readonly class UsageSource
{
    public function __construct(public string $id, public int $order, public int $observedAt) {}

    public static function of(string $id, int $order, CarbonImmutable $observedAt): self
    {
        return new self($id, $order, $observedAt->getTimestamp());
    }

    public function observedTime(): CarbonImmutable
    {
        return CarbonImmutable::createFromTimestampUTC($this->observedAt);
    }

    public function isNewerThan(self $other): bool
    {
        if ($this->observedAt !== $other->observedAt) {
            return $this->observedAt > $other->observedAt;
        }

        if ($this->order !== $other->order) {
            return $this->order > $other->order;
        }

        return strcmp($this->id, $other->id) > 0;
    }
}
