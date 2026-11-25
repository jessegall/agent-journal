<?php

declare(strict_types=1);

namespace Tests\States;

use App\Commands\Asks\OfferNextAsk\OfferNextAskCommand;
use App\Events\Asks\AskClosed;
use App\Events\Asks\AskHopAssigned;
use App\Models\Asks\AskHop;
use App\Support\States\AnswerAskState;
use App\Support\States\Support\AnswerAskStateReference;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsState;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\StateObservation;
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

        $this->journal->owner()->agent('Writer')->agent('Other');
    }

    public function test_its_ask_moving_to_another_hop_ends_it(): void
    {
        $this->answering()
            ->given(
                new AskHopAssigned(self::ASK, self::HOP, 'question', $this->journal->actorCalled('Writer')),
                fn (StateObservation $state) => $state->assertLive(),
            )
            ->given(
                new AskHopAssigned('ask-2', 'hop-3', 'question', $this->journal->actorCalled('Other')),
                fn (StateObservation $state) => $state->assertLive(),
            )
            ->given(
                new AskHopAssigned(self::ASK, 'hop-2', 'question', $this->journal->actorCalled('Other')),
                fn (StateObservation $state) => $state->assertFinished(),
            );
    }

    public function test_its_ask_closing_ends_it_and_offers_the_holder_the_next_ask(): void
    {
        $answering = $this->answering();
        $this->journal->sinkCommands();

        $answering
            ->given(new AskClosed('ask-2', 'question'), fn (StateObservation $state) => $state->assertLive())
            ->given(new AskClosed(self::ASK, 'question'), fn (StateObservation $state) => $state->assertFinished());

        $this->journal->assertDispatched(OfferNextAskCommand::class, ['hopId' => self::HOP]);
    }

    /**
     * The state of a hop held in memory only: it keeps what it needs of the hop in its own values.
     */
    private function answering(): StateHandle
    {
        $hop = new AskHop();
        $hop->id = self::HOP;
        $hop->ask_id = self::ASK;
        $hop->version = 1;

        return $this->journal->pushState($this->journal->sessionOf('Writer'), AnswerAskStateReference::forHop($hop));
    }
}
