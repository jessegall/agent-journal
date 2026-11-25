<?php

declare(strict_types=1);

namespace Domain\Sharing\Commands\CreateShare;

use App\Attributes\Commands\Authorize;
use App\Attributes\Commands\RequiresRequestKey;
use App\Enums\Agents\AccessType;
use Domain\Sharing\Policies\SharingPolicy;
use App\Support\Command;
use Domain\Sharing\Support\ShareSummary;

/**
 * The owner shares a root with the linked records a fresh preview showed, for a number of minutes; the request fills
 * in seven days when the owner names none. It runs once per request key, and answers with the share's id, number and
 * state, never its token.
 *
 * @extends Command<ShareSummary>
 */
#[Authorize(SharingPolicy::class, AccessType::Create)]
#[RequiresRequestKey(retentionDays: 31, refusalDays: 365)]
final readonly class CreateShareCommand extends Command
{
    public function __construct(
        public string $previewId,
        public string $previewChecksum,
        public int $minutesUntilExpiry,
        public string $requestKey,
    ) {}
}
