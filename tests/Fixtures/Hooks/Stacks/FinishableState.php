<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Stacks;

use App\Enums\Engine\FrameReuse;
use App\Support\States\AgentState;

/**
 * A state about one subject that is finished once the test has finished that subject.
 */
final class FinishableState extends AgentState
{
    public function __construct(private readonly string $subject, private readonly FinishedSubjects $hasFinished) {}

    public function frameReuse(): FrameReuse
    {
        return FrameReuse::PerSubject;
    }

    public function isFinished(): bool
    {
        return $this->hasFinished->has($this->subject);
    }
}
