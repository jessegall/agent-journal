<?php

declare(strict_types=1);

namespace App\Commands\ReturnCodeReview;

use App\Contracts\CommandHandler;
use App\Enums\ReviewDecisionType;
use App\Support\ActorIdentity;
use App\Support\CodeReviewDecisions;

/**
 * Records the return decision of the review ask's current holder.
 */
final readonly class ReturnCodeReviewHandler implements CommandHandler
{
    public function __construct(private CodeReviewDecisions $decisions) {}

    public function handle(ReturnCodeReviewCommand $command): void
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
