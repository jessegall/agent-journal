<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Sharing\ShareState;
use DateTimeImmutable;

/**
 * What a sharing lifecycle event tells about one share: its id, the gateway configuration it is served under (none
 * for a proposal), its state, its scope version and when it changed. Never a token, address, body or model.
 */
final readonly class ShareFact
{
    public function __construct(
        public string $shareId,
        public string|null $configurationId,
        public ShareState $state,
        public int $scopeVersion,
        public DateTimeImmutable $occurredAt,
    ) {}
}
