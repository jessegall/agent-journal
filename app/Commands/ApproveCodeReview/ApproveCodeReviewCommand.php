<?php

declare(strict_types=1);

namespace App\Commands\ApproveCodeReview;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\RepeatableRead;
use App\Enums\AccessType;
use App\Enums\CommandEffectType;
use App\Policies\AskPolicy;
use App\Support\Command;
use App\Values\AskReference;

/**
 * The current holder of a review ask approves the reviewed work on its exact base and head: the review is resolved
 * and one merge ask opens on the merge route of the role the review was first sent to.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class ApproveCodeReviewCommand extends Command
{
    public function __construct(
        public AskReference $ask,
        public int $expectedVersion,
        public string $findings,
    ) {}
}
