<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\ChangeSequence;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Support\Command;
use Domain\Sequences\Data\SequenceStepData;
use Domain\Sequences\Policies\StoredSequencePolicy;

/**
 * Replaces a stored sequence's name and steps, refused when it changed since the version the editor opened.
 *
 * @extends Command<null>
 */
#[Authorize(StoredSequencePolicy::class, AccessType::Edit)]
final readonly class ChangeSequenceCommand extends Command
{
    /**
     * @param  list<SequenceStepData>  $steps
     */
    public function __construct(
        public string $sequenceId,
        public int $openedVersion,
        public string $name,
        public array $steps,
    ) {}
}
