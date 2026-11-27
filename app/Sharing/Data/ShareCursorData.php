<?php

declare(strict_types=1);

namespace App\Sharing\Data;

use App\Sharing\Support\ShareCursor;
use App\Sharing\Support\SharePlace;
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

    public static function fromShareCursor(ShareCursor $cursor): self
    {
        return new self(
            $cursor->place->shareId,
            $cursor->place->scopeVersion,
            $cursor->place->path,
            $cursor->place->relation,
            $cursor->place->ordering,
            $cursor->continuation,
        );
    }

    public function cursor(): ShareCursor
    {
        $place = new SharePlace($this->shareId, $this->scopeVersion, $this->path, $this->relation, $this->ordering);

        return new ShareCursor($place, $this->continuation);
    }
}
