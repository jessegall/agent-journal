<?php

declare(strict_types=1);

namespace App\Commands\ApproveCodeReview;

use App\Contracts\CommandHandler;
use App\Enums\ReviewDecisionType;
use App\Support\ActorIdentity;
use App\Support\CodeReviewDecisions;

/**
 * Records the approve decision of the review ask's current holder.
 */
final readonly class ApproveCodeReviewHandler implements CommandHandler
{
    public function __construct(private CodeReviewDecisions $decisions) {}

    public function handle(ApproveCodeReviewCommand $command): void
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
