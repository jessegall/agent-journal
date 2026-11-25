<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use App\Support\RecordIdentity;

/**
 * One step of a public read path: the declared relation followed, and the record it leads to.
 */
final readonly class ShareReadHop
{
    public function __construct(
        public string $relation,
        public RecordIdentity $target,
    ) {}
}
