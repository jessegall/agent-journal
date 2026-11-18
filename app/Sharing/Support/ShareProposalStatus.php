<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Sharing\Enums\ShareState;

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
