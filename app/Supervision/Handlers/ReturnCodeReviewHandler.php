<?php

declare(strict_types=1);

namespace App\Supervision\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Contracts\CommandHandler;
use App\Supervision\Commands\ReturnCodeReview;
use App\Supervision\Enums\ReviewDecisionType;
use App\Supervision\Support\CodeReviewDecisions;

/**
 * Records the return decision of the review ask's current holder.
 */
final readonly class ReturnCodeReviewHandler implements CommandHandler
{
    public function __construct(private CodeReviewDecisions $decisions) {}

    public function handle(ReturnCodeReview $command): void
    {
        $this->decisions->decide(
            $command->ask,
            $command->expectedVersion,
            ReviewDecisionType::Returned,
            ActorIdentity::of($command->dispatchedBy()),
            $command->findings,
        );
    }
}
