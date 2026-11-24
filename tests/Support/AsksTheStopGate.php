<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Enums\AnswerType;
use App\Support\Decisions\ContextLine;
use App\Support\Decisions\MessageLine;
use App\Support\Inputs\Values\HookIdentity;
use App\Support\Stack\StateAnswer;
use App\Support\States\Contracts\StopConditionGate;
use Tests\Fixtures\Agents\TestStart;

/**
 * Asks the stop gate about a stop of the started agent and reads its answer the way the stack gathers it: a delegate
 * lets the stop through.
 */
trait AsksTheStopGate
{
    private function stop(TestStart $start, string $stopId): StateAnswer
    {
        $hook = new HookIdentity($start->agent->id, $start->session->id, $stopId, 'digest');
        $start->startRequest($this->app);

        return StateAnswer::of($this->app->make(StopConditionGate::class)->answer($hook), StopConditionGate::class, 'answer');
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
