<?php

declare(strict_types=1);

namespace Tests\Fixtures\Hooks\Lifecycle;

use App\Hooks\Lifecycle\LifecycleContext;
use App\Hooks\States\AgentState;
use App\Hooks\Values\LifecycleCommands;
use Tests\Support\Exceptions\SimulatedFailure;

/**
 * A fixture state that writes each lifecycle call it gets to a shared log.
 */
final class RecordingState extends AgentState
{
    public function __construct(
        private readonly string $subject,
        private readonly bool $finished,
        private readonly LifecycleLog $log,
    ) {}

    public function isFinished(): bool
    {
        return $this->finished;
    }

    public function onEnter(LifecycleContext $context): LifecycleCommands
    {
        if (in_array($this->subject, $this->log->failingEnters, true)) {
            throw SimulatedFailure::of("enter of {$this->subject} failed");
        }

        $this->log->calls[] = "enter:{$this->subject}";

        return $this->log->answerOf("enter:{$this->subject}");
    }

    public function onResume(LifecycleContext $context): LifecycleCommands
    {
        $this->log->calls[] = "resume:{$this->subject}";

        return $this->log->answerOf("resume:{$this->subject}");
    }

    public function onExit(LifecycleContext $context): LifecycleCommands
    {
        $this->log->calls[] = "exit:{$this->subject}";

        return $this->log->answerOf("exit:{$this->subject}");
    }
}
