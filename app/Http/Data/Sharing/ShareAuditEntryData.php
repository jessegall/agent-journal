<?php

declare(strict_types=1);

namespace App\Http\Data\Sharing;

use App\Sharing\Enums\ShareAuditActor;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Support\ShareAuditEntry;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One audit row on the share's page: what happened, when, why, who it shows as having acted, and whether it was a
 * public read.
 */
#[TypeScript]
final class ShareAuditEntryData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly ShareAuditType $type,
        public readonly string $occurredAt,
        public readonly string|null $reasonCode,
        public readonly ShareAuditActor $actor,
        public readonly bool $isRead,
    ) {}

    public static function fromEntry(ShareAuditEntry $entry): self
    {
        return new self(
            $entry->id,
            $entry->type,
            $entry->occurredAt->toIso8601String(),
            $entry->reasonCode,
            $entry->actor,
            $entry->type->isRead(),
        );
    }
}
