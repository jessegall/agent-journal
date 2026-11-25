<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\DefineSequence;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Support\Command;
use Domain\Sequences\Policies\StoredSequencePolicy;
use Domain\Sequences\Values\SequenceStep;

/**
 * Stores a new sequence with its name and steps; answers its id.
 *
 * @extends Command<string>
 */
#[Authorize(StoredSequencePolicy::class, AccessType::Create)]
final readonly class DefineSequenceCommand extends Command
{
    /**
     * @param  list<SequenceStep>  $steps
     */
    public function __construct(
        public string $name,
        public array $steps,
    ) {}
}
