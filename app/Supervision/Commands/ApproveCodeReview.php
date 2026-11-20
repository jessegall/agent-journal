<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Supervision\Handlers\ApproveCodeReviewHandler;
use App\Supervision\Policies\AskPolicy;
use App\Supervision\Values\AskReference;

/**
 * The current holder of a review ask approves the reviewed work on its exact base and head: the review is resolved
 * and one merge ask opens on the merge route of the role the review was first sent to.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[HandledBy(ApproveCodeReviewHandler::class)]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class ApproveCodeReview extends Command
{
    public function __construct(
        public AskReference $ask,
        public int $expectedVersion,
        public string $findings,
    ) {}
}
