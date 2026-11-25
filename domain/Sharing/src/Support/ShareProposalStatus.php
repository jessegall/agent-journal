<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use Domain\Sharing\Enums\ShareState;

/**
 * What an agent learns of its own share proposal: its number and state, never a token, address or configuration.
 */
final readonly class ShareProposalStatus
{
    public function __construct(
        public int $number,
        public ShareState $state,
    ) {}
}
