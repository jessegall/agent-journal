<?php

declare(strict_types=1);

namespace App\Commands\Reviews\ResolveMergeAttempt;

use App\Attributes\Authorize;
use App\Attributes\Effect;
use App\Attributes\RepeatableRead;
use App\Enums\AccessType;
use App\Enums\CommandEffectType;
use App\Enums\MergeAttemptState;
use App\Policies\AskPolicy;
use App\Support\Command;

/**
 * The owner states how an uncertain merge ended: merged, with the commit it made, or refused; the statement is kept
 * as the owner's, and the merge ask settles by it.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Effect(CommandEffectType::AssignmentChange)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class ResolveMergeAttemptCommand extends Command
{
    public function __construct(
        public string $attemptId,
        public MergeAttemptState $outcome,
        public string|null $result,
        public string $statement,
    ) {}
}
