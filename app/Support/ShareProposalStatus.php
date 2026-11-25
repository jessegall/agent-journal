<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Sharing\ShareState;

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
