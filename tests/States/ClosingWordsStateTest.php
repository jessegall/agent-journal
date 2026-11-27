<?php

declare(strict_types=1);

namespace Tests\States;

use App\Hooks\Enums\AnswerType;
use App\Models\Agents\AgentRuntime;
use App\Models\Drivers\DriverTurn;
use App\Sessions\States\ClosingWordsState;
use App\Sessions\States\Support\ClosingWordsStateReference;
use App\Stacks\References\StateReference;
use Carbon\CarbonImmutable;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\SessionHook;
use Tests\Support\Seeding\StateHandle;
use Tests\TestCase;

/**
 * Every session's stack holds its closing-words state: a stop that ends a turn with words the turn has not offered is
 * refused once with the offer to send them, a stop that repeats them keeps them private, and a stop with no words
 * passes.
 */
#[TestsState(ClosingWordsState::class)]
final class ClosingWordsStateTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['agent_stacks', 'command_receipts', 'driver_turns'];

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner');
        $runtime = AgentRuntime::findForSession($this->journal->sessionOf('Planner')->id);
        DriverTurn::create($runtime->id, $runtime->process_generation, 'prompt-1', CarbonImmutable::now());
    }

    public function test_words_not_offered_are_offered_once_and_repeated_they_stay_private(): void
    {
        $this->journal->stateOn('Planner', $this->closingWords(), fn (StateHandle $words) => $words
            ->steps([SessionHook::stop('prompt-1', 'Half way.')], fn (StateAssert $state) => $state
                ->answers(AnswerType::Deny)
                ->isLive())
            ->steps([SessionHook::stop('prompt-1', 'Half way.')], fn (StateAssert $state) => $state
                ->answers(AnswerType::Delegate)));

        $turn = DriverTurn::findForSessionTurn($this->journal->sessionOf('Planner')->id, 'prompt-1');
        $this->journal->assertResult([true, false], [$turn?->hasOffered('Half way.'), $turn?->isOfferPending()]);
    }

    public function test_a_stop_with_no_closing_words_passes(): void
    {
        $this->journal->stateOn('Planner', $this->closingWords(), fn (StateHandle $words) => $words
            ->stop(fn (StateAssert $state) => $state->stackAnswers(AnswerType::Allow)));
    }

    private function closingWords(): StateReference
    {
        return ClosingWordsStateReference::forSession($this->journal->sessionOf('Planner')->target);
    }
}
