<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\Command;
use App\Sharing\Handlers\ApproveShareRequestHandler;
use App\Sharing\Support\ShareSummary;

/**
 * The owner approves an agent's proposal from a fresh preview of the same record, for a number of minutes: the
 * proposal becomes the owner's grant, independent of the agent's session from then on.
 *
 * @implements Command<ShareSummary>
 */
#[HandledBy(ApproveShareRequestHandler::class)]
#[RequiresActor(ActorType::User)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class ApproveShareRequest implements Command
{
    public function __construct(
        public string $shareId,
        public string $previewId,
        public string $previewChecksum,
        public int $minutesUntilExpiry,
        public string $requestKey,
    ) {}
}
