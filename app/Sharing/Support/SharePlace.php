<?php

declare(strict_types=1);

namespace App\Sharing\Support;

/**
 * Where a page of one relation is read: one share at one scope version, along one path and relation, in one order.
 */
final readonly class SharePlace
{
    public const string ORDER_WRITTEN_THEN_ID = 'written,id';

    public function __construct(
        public string $shareId,
        public int $scopeVersion,
        public string $path,
        public string $relation,
        public string $ordering,
    ) {}

    public function isSameAs(self $other): bool
    {
        return get_object_vars($this) === get_object_vars($other);
    }
}
