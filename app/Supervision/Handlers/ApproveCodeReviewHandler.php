<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Supervision\Commands\ApproveCodeReview;
use App\Supervision\Enums\ReviewDecisionType;
use App\Supervision\Support\CodeReviewDecisions;

/**
 * Records the approve decision of the review ask's current holder.
 */
final readonly class ApproveCodeReviewHandler implements CommandHandler
{
    public function __construct(private CodeReviewDecisions $decisions) {}

    public function handle(ApproveCodeReview $command): void
    {
        $this->decisions->decide(
            $command->ask,
            $command->expectedVersion,
            ReviewDecisionType::Approved,
            ActorIdentity::of($command->dispatchedBy()),
            $command->findings,
        );
    }
}
