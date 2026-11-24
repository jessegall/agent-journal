<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\StateLoading;

use App\Support\States\AgentState;
use Tests\Fixtures\Hooks\Counting\CountedValues;
use Tests\Fixtures\Hooks\Stacks\FinishedSubjects;
use Tests\Fixtures\Web\Types\ShelfState;

/**
 * A state that keeps one value of every kind a state may keep, beside a collaborator it is given and never keeps.
 */
final class KeptValuesState extends AgentState
{
    private bool $isOpen = true;

    private CountedValues $counted;

    /**
     * @param  list<string>  $names
     */
    public function __construct(
        private readonly string $subject,
        private readonly int $number,
        private readonly ShelfState $shelf,
        private readonly array $names,
        private readonly FinishedSubjects $finished,
    ) {
        $this->counted = new CountedValues();
    }

    public function isFinished(): bool
    {
        return ! $this->isOpen || $this->finished->has($this->subject);
    }

    public function close(): void
    {
        $this->isOpen = false;
        $this->counted = new CountedValues($this->counted->count + $this->number + count($this->names));
    }

    public function shelf(): ShelfState
    {
        return $this->shelf;
    }

    public function finished(): FinishedSubjects
    {
        return $this->finished;
    }
}
