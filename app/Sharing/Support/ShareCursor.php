<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use Spatie\LaravelData\Data;

/**
 * Where a page of one relation goes on, for one share at one scope version, along one path and relation, in one
 * order, after the provider's continuation. It travels signed, as ShareCursors writes it.
 */
final class ShareCursor extends Data
{
    public const string ORDER_WRITTEN_THEN_ID = 'written,id';

    public function __construct(
        public readonly string $shareId,
        public readonly int $scopeVersion,
        public readonly string $path,
        public readonly string $relation,
        public readonly string $ordering,
        public readonly string $continuation,
    ) {}

    /**
     * Whether this cursor was made for the same share, scope version, path, relation and order.
     */
    public function belongsTo(self $expected): bool
    {
        return [$this->shareId, $this->scopeVersion, $this->path, $this->relation, $this->ordering]
            === [
                $expected->shareId,
                $expected->scopeVersion,
                $expected->path,
                $expected->relation,
                $expected->ordering,
            ];
    }
}
