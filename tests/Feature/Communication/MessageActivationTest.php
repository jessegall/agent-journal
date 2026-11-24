<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\ReadMessages\ReadMessagesCommand;
use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use App\Contracts\Actors\ActorWorkStacks;
use App\Models\Agents\AgentStackRow;
use App\Models\Messages\Message;
use App\Support\MessageAnswerActivation;
use App\Support\References\StateReference;
use App\Support\States\Support\AnsweringMessageStateReference;
use App\Support\Storage\FrameRecord;
use PhpOption\Option;
use Tests\Support\MessagingTestCase;

/**
 * An agent holding a claim on a question is given one answering frame for the question's chat at the start of a hook,
 * with the question waiting; the frame finishes once the question is answered.
 */
final class MessageActivationTest extends MessagingTestCase
{
    public function test_a_claim_gets_one_answering_frame_that_finishes_with_the_answer(): void
    {
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Which port?');
        $this->asAgent($this->builder);
        $this->runOnBus(new ReadMessagesCommand($this->inboxIdOf($this->builder), [$questionId]));
        $this->activate();
        $this->activate();

        $this->assertSame($this->inboxIdOf($this->builder), $this->currentFrame()->get()->subject->id);
        $this->assertSame([$questionId], $this->waitingIds());

        $version = Message::query()->findOrFail($questionId)->state_version;
        $this->runOnBus(new ReplyToMessageCommand($questionId, $version, 'Port 8080.'));

        $this->assertSame([], $this->waitingIds());
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

    /**
     * The messages the agent's saved answering frame still waits to answer, as the state keeps them.
     *
     * @return list<string>
     */
    private function waitingIds(): array
    {
        $frames = AgentStackRow::query()->withoutGlobalScopes()->get()
            ->flatMap(fn (AgentStackRow $row) => $row->frames->all())
            ->filter(fn (FrameRecord $frame) => $frame->reference->typeKey === AnsweringMessageStateReference::TYPE_KEY);

        return $frames->sole()->values['waitingIds'];
    }

    /**
     * @return Option<StateReference>
     */
    private function currentFrame(): Option
    {
        return $this->app->make(ActorWorkStacks::class)->current(AnsweringMessageStateReference::TYPE_KEY);
    }
}
