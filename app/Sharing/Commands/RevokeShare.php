<?php

declare(strict_types=1);

namespace App\Sharing\Commands;

use App\Actors\Enums\ActorType;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RequiresActor;
use App\Bus\Attributes\RequiresRequestKey;
use App\Bus\Contracts\Command;
use App\Sharing\Handlers\RevokeShareHandler;
use App\Sharing\Support\ShareSummary;

/**
 * The owner revokes a share or dismisses a proposal: it ends at once in the database, whether or not its gateway is
 * reachable, and revoking it again changes nothing.
 *
 * @implements Command<ShareSummary>
 */
#[HandledBy(RevokeShareHandler::class)]
#[RequiresActor(ActorType::User)]
#[RequiresRequestKey(retentionDays: 31, tombstoneDays: 365)]
final readonly class RevokeShare implements Command
{
    public function __construct(
        public string $shareId,
        public string $requestKey,
    ) {}
}
