<?php

declare(strict_types=1);

namespace Domain\Sequences\Commands\DefineSequence;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Projects\Contracts\ProjectCommand;
use App\Support\Command;
use App\Values\ProjectOwner;
use Domain\Sequences\Policies\StoredSequencePolicy;
use Domain\Sequences\Values\SequenceStep;

/**
 * Stores a new sequence with its name and steps, of a project or Global by its owner key; answers its id.
 *
 * @extends Command<string>
 */
#[Authorize(StoredSequencePolicy::class, AccessType::Create)]
final readonly class DefineSequenceCommand extends Command implements ProjectCommand
{
    /**
     * @param  list<SequenceStep>  $steps
     */
    public function __construct(
        public string $name,
        public array $steps,
        public string $ownerKey,
    ) {}

    public function owner(): ProjectOwner
    {
        return ProjectOwner::fromKey($this->ownerKey);
    }
}
