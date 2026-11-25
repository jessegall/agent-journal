<?php

declare(strict_types=1);

namespace Tests\Feature\States;

use App\Events\Asks\AskHopAssigned;
use App\Models\Asks\AskHop;
use App\Support\States\Support\AnswerAskStateReference;
use Tests\Support\StateScenario;
use Tests\Support\TestActors;
use Tests\Support\TestsStates;
use Tests\TestCase;

/**
 * The answer-ask state on the real engine: it waits on its ask and ends when the ask moves to another hop.
 */
final class AnswerAskStateTest extends TestCase
{
    use TestsStates;

    private const string ASK = 'ask-1';

    private const string HOP = 'hop-1';

    public function test_its_ask_moving_to_another_hop_ends_it(): void
    {
        $this->answering()
            ->given(new AskHopAssigned(self::ASK, self::HOP, 'question', TestActors::agentIdentity(1)))
            ->assertActive()
            ->given(new AskHopAssigned(self::ASK, 'hop-2', 'question', TestActors::agentIdentity(3)))
            ->assertPopped();
    }

    private function answering(): StateScenario
    {
        $hop = new AskHop();
        $hop->id = self::HOP;
        $hop->ask_id = self::ASK;
        $hop->version = 1;

        return $this->scenario(AnswerAskStateReference::forHop($hop));
    }
}
