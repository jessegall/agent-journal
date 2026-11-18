<?php

declare(strict_types=1);

namespace App\Http\Data\Assignments;

use App\Assignments\Support\AutoAssignmentFact;
use Carbon\CarbonImmutable;
use PhpOption\Option;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Optional;

/**
 * One stored auto-assignment in a list: whose, for which type, on or off, its pool key, size and revision, and when
 * it last gave an item, if ever.
 */
final class AutoAssignmentFactData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $actorType,
        public readonly string $actorId,
        public readonly string $assignableType,
        public readonly bool $enabled,
        public readonly string $pool,
        public readonly int $size,
        public readonly int $revision,
        public readonly string|Optional $lastServedAt = new Optional(),
    ) {}

    public static function of(AutoAssignmentFact $fact): self
    {
        return self::from([
            'id' => $fact->id,
            'actorType' => $fact->key->actor->type->value,
            'actorId' => $fact->key->actor->id,
            'assignableType' => $fact->key->assignableType,
            'enabled' => $fact->enabled,
            'pool' => $fact->pool->type,
            'size' => $fact->size,
            'revision' => $fact->revision,
            'lastServedAt' => Option::fromValue($fact->lastServedAt)
                ->map(fn (CarbonImmutable $time) => $time->toIso8601String())
                ->getOrElse(Optional::create()),
        ]);
    }
}
