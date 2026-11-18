<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Sharing\Enums\ShareRelationType;

/**
 * One relation a shareable record type declares: its stable name, owned or linked, and the capability a record must
 * advertise to be reached through it.
 */
final readonly class ShareRelation
{
    public function __construct(
        public string $name,
        public ShareRelationType $type,
        public string $capability,
    ) {}
}
