<?php

declare(strict_types=1);

namespace Domain\Sharing\Data;

use Domain\Sharing\Support\ShareCursor;
use Spatie\LaravelData\Data;

/**
 * A page cursor as its signed text carries it: what ShareCursor holds, by its property names.
 */
final class ShareCursorData extends Data
{
    public function __construct(
        public readonly string $shareId,
        public readonly int $scopeVersion,
        public readonly string $path,
        public readonly string $relation,
        public readonly string $ordering,
        public readonly string $continuation,
    ) {}

    public function cursor(): ShareCursor
    {
        return new ShareCursor(
            $this->shareId,
            $this->scopeVersion,
            $this->path,
            $this->relation,
            $this->ordering,
            $this->continuation,
        );
    }
}
