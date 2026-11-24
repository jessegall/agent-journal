<?php

declare(strict_types=1);

namespace App\Commands\CreateShare;

use App\Attributes\Authorize;
use App\Attributes\RequiresRequestKey;
use App\Enums\AccessType;
use App\Policies\SharingPolicy;
use App\Support\Command;
use App\Support\ShareSummary;

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
