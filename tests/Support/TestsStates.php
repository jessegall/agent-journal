<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Contracts\Actors\AgentTexts;
use App\Support\Drivers\DriverReplies;
use App\Support\Inputs\Contracts\HookInput;
use App\Support\OperationDeadline;
use App\Support\References\StateReference;
use App\Support\Stack\HookAnswer;

/**
 * Tests a state by a scenario on the real engine, on the committed hook stack of agent 1 in session 10.
 */
trait TestsStates
{
    use CommittedHookStack;

    private int $scenarioCallCount = 0;

    /**
     * The state pushed onto the agent's stack, ready for its given steps.
     */
    protected function scenario(StateReference $state): StateScenario
    {
        $scenario = new StateScenario($this->app, $this->target, $state, $this->answerHook(...));

        return $scenario->pushed();
    }

    /**
     * Sends the hook input through the agent's state machine under a call id of its own, so it is answered rather than
     * replayed, and returns the answer the stack gave it.
     */
    private function answerHook(HookInput $input): HookAnswer
    {
        $answered = null;
        $this->scenarioCallCount++;
        $this->callAs("scenario-call-{$this->scenarioCallCount}");

        $this->machine()->answer(
            $input,
            $this->capabilities(),
            new OperationDeadline(3000),
            function (HookAnswer $answer, AgentTexts $texts) use (&$answered) {
                $answered = $answer;

                return DriverReplies::allowTool($answer->shownContext($texts));
            },
        );

        return $answered;
    }
}
