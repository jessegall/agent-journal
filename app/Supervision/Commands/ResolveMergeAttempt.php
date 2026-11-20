<?php

declare(strict_types=1);

namespace App\Supervision\Commands;

use App\Agents\Enums\MergeAttemptState;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\Effect;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\RepeatableRead;
use App\Bus\Enums\CommandEffectType;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Supervision\Handlers\ResolveMergeAttemptHandler;
use App\Supervision\Policies\AskPolicy;

/**
 * The owner states how an uncertain merge ended: merged, with the commit it made, or refused; the statement is kept
 * as the owner's, and the merge ask settles by it.
 *
 * @extends Command<null>
 */
#[RepeatableRead]
#[Effect(CommandEffectType::AssignmentChange)]
#[HandledBy(ResolveMergeAttemptHandler::class)]
#[Authorize(AskPolicy::class, AccessType::Edit)]
final readonly class ResolveMergeAttempt extends Command
{
    public function __construct(
        public string $attemptId,
        public MergeAttemptState $outcome,
        public string|null $result,
        public string $statement,
    ) {}
}
