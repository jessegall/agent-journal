<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Support\Command;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Sharing\Enums\SharingAbility;
use App\Sharing\Handlers\RetryShareHandler;
use App\Sharing\Models\Share;
use App\Sharing\Policies\SharingPolicy;
use App\Sharing\Support\ShareSummary;

/**
 * The owner asks the gateway to open a pending or failed share again, before its deadline, which stays the same.
 *
 * @extends Command<ShareSummary>
 */
#[HandledBy(RetryShareHandler::class)]
#[Authorize(SharingPolicy::class, SharingAbility::Administer)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class RetryShare extends Command implements HasAuthorizationSubject
{
    public function __construct(
        public string $shareId,
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
