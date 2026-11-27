<?php

declare(strict_types=1);

namespace App\Sharing\Support;

/**
 * Where a page of one relation goes on: its place and the provider's continuation after it. It travels signed, as
 * ShareCursors writes it.
 */
final readonly class ShareCursor
{
    public function __construct(
        public SharePlace $place,
        public string $continuation,
    ) {}

    /**
     * Whether this cursor was made for the same share, scope version, path, relation and order.
     */
    public function belongsTo(SharePlace $expected): bool
    {
        return $this->place->isSameAs($expected);
    }
}
