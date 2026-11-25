<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use DateTimeImmutable;
use Domain\Sharing\Enums\ShareStatus;

/**
 * What a sharing lifecycle event tells about one share: its id, the gateway configuration it is served under (none
 * for a proposal), its state, its scope version and when it changed. Never a token, address, body or model.
 */
final readonly class ShareFact
{
    public function __construct(
        public string $shareId,
        public string|null $configurationId,
        public ShareStatus $state,
        public int $scopeVersion,
        public DateTimeImmutable $occurredAt,
    ) {}
}
