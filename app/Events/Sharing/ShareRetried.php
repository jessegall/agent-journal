<?php

declare(strict_types=1);

namespace App\Events\Sharing;

use App\Sharing\Support\ShareFact;

/**
 * A share that failed to open is to be opened again.
 */
final readonly class ShareRetried implements ShareEvent
{
    public function __construct(public ShareFact $share) {}
}
