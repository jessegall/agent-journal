<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Counting\States;

use App\Attributes\States\StateType;
use App\Support\Decisions\Decision;
use App\Support\Inputs\StopRequested;
use App\Support\States\AgentState;
use Tests\Fixtures\Domains\Counting\Events\SubjectSeen;
use Tests\Support\TestText;

/**
 * A test state that counts the facts of its subject it hears, keeps the agent from stopping until it heard as many as
 * its limit, and is finished then.
 */
#[StateType(self::TYPE_KEY, schemaVersion: 1)]
final class CountFactsState extends AgentState
{
    public const string TYPE_KEY = 'counting.count_facts';

    private int $heard = 0;

    public function __construct(private readonly string $subject, private readonly int $limit) {}

    public function isFinished(): bool
    {
        return $this->heard >= $this->limit;
    }

    // ----------[ Hooks ]----------

    public function onStop(StopRequested $input): Decision
    {
        return Decision::deny(TestText::of("Count {$this->subject} first."));
    }

    // ----------[ Events ]----------

    public function onSubjectSeen(SubjectSeen $fact): void
    {
        if ($fact->subject === $this->subject) {
            $this->heard++;
        }
    }
}
