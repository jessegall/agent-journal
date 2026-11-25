<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use Domain\Sharing\Enums\ShareState;

/**
 * What a share command answers with and its receipt keeps: the share's id, number and state, never its token or
 * address.
 */
final readonly class ShareSummary
{
    public function __construct(
        public string $shareId,
        public int $number,
        public ShareState $state,
    ) {}
}
