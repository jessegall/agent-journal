<?php

declare(strict_types=1);

namespace App\Commands\Reviews\ReturnCodeReview;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\RepeatableRead;
use App\Enums\AccessType;
use App\Enums\CommandEffectType;
use App\Policies\AskPolicy;
use App\Support\Command;
use App\Values\AskReference;

/**
 * The current holder of a review ask returns the reviewed work with its findings: the review is resolved as returned,
 * and the decision stands as the one request to repair it.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class ReturnCodeReviewCommand extends Command
{
    public function __construct(
        public AskReference $ask,
        public int $expectedVersion,
        public string $findings,
    ) {}
}
