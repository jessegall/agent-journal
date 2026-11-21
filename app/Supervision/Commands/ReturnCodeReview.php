<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Supervision\Policies\AskPolicy;
use App\Supervision\Values\AskReference;

/**
 * The current holder of a review ask returns the reviewed work with its findings: the review is resolved as returned,
 * and the decision stands as the one request to repair it.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class ReturnCodeReview extends Command
{
    public function __construct(
        public AskReference $ask,
        public int $expectedVersion,
        public string $findings,
    ) {}
}
