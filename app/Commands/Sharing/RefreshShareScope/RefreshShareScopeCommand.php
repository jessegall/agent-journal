<?php

declare(strict_types=1);

namespace App\Commands\Sharing\RefreshShareScope;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RequiresRequestKey;
use App\Enums\Agents\AccessType;
use App\Policies\SharingPolicy;
use App\Support\Command;
use App\Support\ShareSummary;

/**
 * The owner replaces a live share's linked records with those a fresh preview of its root selected, at the next
 * scope version; the token and the deadline stay the same.
 *
 * @extends Command<ShareSummary>
 */
#[Authorize(SharingPolicy::class, AccessType::Edit)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class RefreshShareScopeCommand extends Command
{
    public function __construct(
        public string $shareId,
        public string $previewId,
        public string $previewChecksum,
        public string $requestKey,
    ) {}
}
