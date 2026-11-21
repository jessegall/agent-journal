<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\ShareSummary;

/**
 * The owner replaces a live share's linked records with those a fresh preview of its root selected, at the next
 * scope version; the token and the deadline stay the same.
 *
 * @extends Command<ShareSummary>
 */
#[Authorize(SharingPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class RefreshShareScope extends Command
{
    public function __construct(
        public string $shareId,
        public string $previewId,
        public string $previewChecksum,
        public string $requestKey,
    ) {}
}
