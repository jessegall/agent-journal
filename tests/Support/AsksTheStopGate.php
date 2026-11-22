<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Hooks\Decisions\ContextLine;
use App\Hooks\Decisions\MessageLine;
use App\Hooks\Enums\AnswerType;
use App\Hooks\Inputs\Values\HookIdentity;
use App\Hooks\Stack\StateAnswer;
use App\Hooks\States\Contracts\StopConditionGate;
use Tests\Fixtures\Agents\TestStart;

/**
 * Asks the stop gate about a stop of the started agent and reads its answer the way the stack gathers it: no decision
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
        return $answer->decision === null ? AnswerType::Allow : $answer->decision->answerType();
    }

    /**
     * @return list<string>
     */
    private function messagesOf(StateAnswer $answer): array
    {
        return array_map(fn (ContextLine|MessageLine $line) => $line->text, $answer->lines);
    }
}
