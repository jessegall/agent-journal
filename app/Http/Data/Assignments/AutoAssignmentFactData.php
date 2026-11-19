<?php

declare(strict_types=1);

namespace App\Http\Data\Assignments;

use App\Assignments\Support\AutoAssignmentFact;
use Spatie\LaravelData\Data;

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
        public readonly string|null $lastServedAt = null,
    ) {}

    public static function fromFact(AutoAssignmentFact $fact): self
    {
        $actor = $fact->key->actor;

        return self::from([
            'id' => $fact->id,
            'actorType' => $actor->type->value,
            'actorId' => $actor->id,
            'assignableType' => $fact->key->assignableType,
            'enabled' => $fact->enabled,
            'pool' => $fact->pool->type,
            'size' => $fact->size,
            'revision' => $fact->revision,
            'lastServedAt' => $fact->lastServedAt?->toIso8601String(),
        ]);
    }
}
