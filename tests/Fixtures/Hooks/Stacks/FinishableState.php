<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Stacks;

use App\Enums\Engine\FrameScope;
use App\Support\States\AgentState;

/**
 * A state about one subject that is finished once the test has finished that subject.
 */
final class FinishableState extends AgentState
{
    public function __construct(private readonly string $subject, private readonly FinishedSubjects $hasFinished) {}

    public function frameScope(): FrameScope
    {
        return FrameScope::PerSubject;
    }

    public function isFinished(): bool
    {
        return $this->hasFinished->has($this->subject);
    }
}
