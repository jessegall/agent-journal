<?php

declare(strict_types=1);

namespace Tests\States;

use App\Asks\Commands\OfferNextAsk\OfferNextAskCommand;
use App\Events\Asks\AskClosed;
use App\Events\Asks\AskHopAssigned;
use App\Models\Asks\AskHop;
use App\Stacks\AnswerAskState;
use App\Stacks\Support\AnswerAskStateReference;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\StateHandle;
use Tests\TestCase;

/**
 * The answer-ask state on the real engine: it waits on its hop until its ask closes, which offers the holder the next
 * ask, or until the ask moves to another hop; another ask's close or hop changes nothing.
 */
#[TestsState(AnswerAskState::class)]
final class AnswerAskStateTest extends TestCase
{
    use CommitsHookRows;

    /**
     * Facts reach a stack once its change commits, so these tests commit and empty what they wrote.
     */
    private const array TABLES = ['agent_stacks', 'command_receipts'];

    private const string ASK = 'ask-1';

    private const string HOP = 'hop-1';

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Writer')->agent('Other')->pushState('Writer', $this->answering());
    }

    public function test_its_ask_moving_to_another_hop_ends_it(): void
    {
        $this->journal->stateOn('Writer', $this->answering(), fn (StateHandle $answering) => $answering
            ->event(
                new AskHopAssigned(self::ASK, self::HOP, 'question', $this->journal->actorCalled('Writer')),
                fn (StateAssert $state) => $state->isLive(),
            )
            ->event(
                new AskHopAssigned('ask-2', 'hop-3', 'question', $this->journal->actorCalled('Other')),
                fn (StateAssert $state) => $state->isLive(),
            )
            ->event(
                new AskHopAssigned(self::ASK, 'hop-2', 'question', $this->journal->actorCalled('Other')),
                fn (StateAssert $state) => $state->isFinished(),
            ));
    }

    public function test_its_ask_closing_ends_it_and_offers_the_holder_the_next_ask(): void
    {
        $this->journal->sinkCommands()->stateOn('Writer', $this->answering(), fn (StateHandle $answering) => $answering
            ->event(new AskClosed('ask-2', 'question'), fn (StateAssert $state) => $state->isLive())
            ->event(new AskClosed(self::ASK, 'question'), fn (StateAssert $state) => $state->isFinished()));

        $this->journal->assertDispatched(OfferNextAskCommand::class, ['hopId' => self::HOP]);
    }

    /**
     * The state of a hop held in memory only: it keeps what it needs of the hop in its own values.
     */
    private function answering(): AnswerAskStateReference
    {
        $hop = new AskHop();
        $hop->id = self::HOP;
        $hop->ask_id = self::ASK;
        $hop->version = 1;

        return AnswerAskStateReference::forHop($hop);
    }
}
