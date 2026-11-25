<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\ChangeSequence;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Sequences\Policies\StoredSequencePolicy;
use Domain\Sequences\Values\SequenceStep;

/**
 * Replaces a stored sequence's name and steps, refused when it changed since the version the editor opened.
 *
 * @extends Command<null>
 */
#[Authorize(StoredSequencePolicy::class, AccessType::Edit)]
final readonly class ChangeSequenceCommand extends Command
{
    /**
     * @param  list<SequenceStep>  $steps
     */
    public function __construct(
        public string $sequenceId,
        public int $openedVersion,
        public string $name,
        public array $steps,
    ) {}
}
