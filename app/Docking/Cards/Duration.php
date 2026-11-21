<?php

declare(strict_types=1);

namespace App\Docking\Cards;

use App\Docking\Cards\Contracts\DockPart;
use App\Docking\Enums\PartType;
use App\Docking\Exceptions\DockCardInvalid;
use DateTimeImmutable;

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
