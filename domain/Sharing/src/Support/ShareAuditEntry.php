<?php

declare(strict_types=1);

namespace Domain\Sharing\Support;

use Carbon\CarbonImmutable;
use Domain\Sharing\Enums\ShareAuditActor;
use Domain\Sharing\Enums\ShareAuditType;

/**
 * One audit row as the owner reads it: what happened, when, why, and who it shows as having acted.
 */
final readonly class ShareAuditEntry
{
    public function __construct(
        public string $id,
        public ShareAuditType $type,
        public CarbonImmutable $occurredAt,
        public string|null $reasonCode,
        public ShareAuditActor $actor,
    ) {}
}
