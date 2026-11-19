<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Sharing\Enums\SharingAbility;
use App\Sharing\Handlers\CreateShareHandler;
use App\Sharing\Models\Share;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\ShareSummary;

/**
 * The owner shares a root with the linked records a fresh preview showed, for a number of minutes; the request fills
 * in seven days when the owner names none. It runs once per request key, and answers with the share's id, number and
 * state, never its token.
 *
 * @implements Command<ShareSummary>
 */
#[HandledBy(CreateShareHandler::class)]
#[Authorize(SharingPolicy::class, SharingAbility::Administer)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class CreateShare implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $previewId,
        public string $previewChecksum,
        public int $minutesUntilExpiry,
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
