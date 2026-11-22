<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\ReadMessages\ReadMessagesCommand;
use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use App\Contracts\Actors\ActorWorkStacks;
use App\Models\Message;
use App\Support\Decisions\StateReferences;
use App\Support\MessageAnswerActivation;
use App\Support\References\StateReference;
use App\Support\States\AgentState;
use App\Support\States\Support\AnsweringMessageStateFactory;
use App\Support\States\Support\AnsweringMessageStateReference;
use PhpOption\Option;
use Tests\Support\MessagingTestCase;

/**
 * An agent holding a claim on a question is given one answering frame, named by that claim, at the start of a hook;
 * the frame stands while the claim does and finishes once the question is answered.
 */
final class MessageActivationTest extends MessagingTestCase
{
    public function test_a_claim_gets_one_answering_frame_that_finishes_with_the_answer(): void
    {
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Which port?');
        $this->asAgent($this->builder);
        $this->runOnBus(new ReadMessagesCommand($this->inboxIdOf($this->builder), [$questionId]));
        $claimId = $this->claimsOn($questionId)[$questionId]->reference->id;

        $this->activate();
        $this->activate();

        $frame = $this->currentFrame()->get();
        $this->assertEquals(AnsweringMessageStateReference::forClaim($claimId), $frame);
        $this->assertFalse($this->stateOf($claimId)->isFinished());

        $version = Message::query()->findOrFail($questionId)->state_version;
        $this->runOnBus(new ReplyToMessageCommand($questionId, $version, 'Port 8080.'));

        $this->assertTrue($this->stateOf($claimId)->isFinished());
    }

    public function test_an_agent_with_no_claim_gets_no_frame(): void
    {
        $this->ownerAsks($this->inboxIdOf($this->builder), 'Which port?');
        $this->asAgent($this->builder);

        $this->activate();

        $this->assertTrue($this->currentFrame()->isEmpty());
    }

    private function activate(): void
    {
        $this->app->make(MessageAnswerActivation::class)->accept();
    }

    private function stateOf(string $claimId): AgentState
    {
        $references = new StateReferences([AnsweringMessageStateReference::forClaim($claimId)]);

        return $this->app->make(AnsweringMessageStateFactory::class)->statesFor($references)->stateAt(0);
    }

    /**
     * @return Option<StateReference>
     */
    private function currentFrame(): Option
    {
        return $this->app->make(ActorWorkStacks::class)->current(AnsweringMessageStateReference::TYPE_KEY);
    }
}
