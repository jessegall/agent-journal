<?php

declare(strict_types=1);

namespace App\Sharing\Support;

use App\Sharing\Enums\ShareAuditActor;
use App\Sharing\Enums\ShareAuditType;
use Carbon\CarbonImmutable;

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
