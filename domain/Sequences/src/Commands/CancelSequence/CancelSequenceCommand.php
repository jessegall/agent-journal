<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\CancelSequence;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Sequences\Policies\SequencePolicy;

/**
 * Cancels a run, leaving its steps undone.
 *
 * @extends Command<null>
 */
#[Authorize(SequencePolicy::class, AccessType::Edit)]
final readonly class CancelSequenceCommand extends Command
{
    public function __construct(
        public string $sequenceRunId,
    ) {}
}
