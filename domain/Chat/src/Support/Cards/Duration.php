<?php

declare(strict_types=1);

namespace Domain\Chat\Support\Cards;

use DateTimeImmutable;
use Domain\Chat\Contracts\Docking\DockPart;
use Domain\Chat\Enums\PartType;
use Domain\Chat\Exceptions\DockCardInvalid;

/**
 * How long something ran: counted locally from its start while it runs, and fixed once it finished.
 */
final readonly class Duration implements DockPart
{
    public function __construct(
        public string $key,
        public DateTimeImmutable $startedAt,
        public DateTimeImmutable|null $finishedAt = null,
    ) {
        PartKey::assertGiven($key, PartType::Duration);

        if ($finishedAt !== null && $finishedAt < $startedAt) {
            throw DockCardInvalid::finishedBeforeStart($key);
        }
    }

    public function key(): string
    {
        return $this->key;
    }

    public function type(): PartType
    {
        return PartType::Duration;
    }

    public function children(): array
    {
        return [];
    }
}
