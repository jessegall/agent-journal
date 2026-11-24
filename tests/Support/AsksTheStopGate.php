<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Enums\AnswerType;
use App\Events\Sessions\StopAttemptSettled;
use App\Support\Decisions\ContextLine;
use App\Support\Decisions\MessageLine;
use App\Support\Inputs\StopRequested;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Inputs\Values\StopDetails;
use App\Support\Stack\StateAnswer;
use App\Support\States\ReadyState;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestStart;

/**
 * Asks the ready state about a stop of the started agent and reads its answer the way the stack gathers it: a delegate
 * lets the stop through. The state hears each settled stop attempt, as the bottom of the agent's stack does.
 */
trait AsksTheStopGate
{
    private ReadyState $readyState;

    private function stop(TestStart $start, string $stopId): StateAnswer
    {
        $hook = new HookIdentity($start->agent->id, $start->session->id, $stopId, 'digest');
        $start->startRequest($this->app);
        $stop = new StopRequested($hook, new StopDetails('turn', false, ''));

        return StateAnswer::of($this->readyState()->onStop($stop), ReadyState::class, 'onStop');
    }

    private function readyState(): ReadyState
    {
        if (! isset($this->readyState)) {
            $this->readyState = $this->app->make(ReadyState::class);
            Event::listen(StopAttemptSettled::class, $this->readyState->onStopAttemptSettled(...));
        }

        return $this->readyState;
    }

    private function typeOf(StateAnswer $answer): AnswerType
    {
        $type = $answer->decision->answerType();

        return $type === AnswerType::Delegate ? AnswerType::Allow : $type;
    }

    /**
     * @return list<string>
     */
    private function messagesOf(StateAnswer $answer): array
    {
        return array_map(fn (ContextLine|MessageLine $line) => TestText::words($line->text), $answer->lines);
    }
}
