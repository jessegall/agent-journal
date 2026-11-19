<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Sharing\Enums\SharingAbility;
use App\Sharing\Handlers\RefreshShareScopeHandler;
use App\Sharing\Models\Share;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\ShareSummary;

/**
 * The owner replaces a live share's linked records with those a fresh preview of its root selected, at the next
 * scope version; the token and the deadline stay the same.
 *
 * @implements Command<ShareSummary>
 */
#[HandledBy(RefreshShareScopeHandler::class)]
#[Authorize(SharingPolicy::class, SharingAbility::Administer)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class RefreshShareScope implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $shareId,
        public string $previewId,
        public string $previewChecksum,
        public string $requestKey,
    ) {}

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Share::class;
    }
}
