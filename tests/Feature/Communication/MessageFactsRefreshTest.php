<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Communication\Commands\DismissMessage;
use App\Communication\Commands\ReadMessages;
use App\Communication\Commands\ReleaseMessageClaim;
use App\Communication\Commands\ReplyToMessage;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Enums\MessageState;
use App\Communication\Events\MessageAnswered;
use App\Communication\Events\MessageAnswerRequired;
use App\Communication\Events\MessageClaimReleased;
use App\Communication\Events\MessageDismissed;
use App\Communication\Events\MessageRead;
use App\Communication\Events\MessageSent;
use App\Communication\Events\MessageTakenUp;
use App\Communication\Models\Message;
use App\Web\Events\PageChanged;
use App\Web\Support\UserChannel;
use Closure;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\Event;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\MessagingTestCase;

/**
 * Every committed change of a message, by the owner or by an agent, tells the owner's open pages to read again once
 * it has committed; a change that rolls back tells nobody.
 */
final class MessageFactsRefreshTest extends MessagingTestCase
{
    /**
     * @var list<class-string>
     */
    private array $facts = [];

    protected function setUp(): void
    {
        parent::setUp();

        Event::fake([PageChanged::class]);

        foreach ($this->messageFacts() as $fact) {
            Event::listen($fact, function (object $raised): void {
                $this->facts[] = $raised::class;
            });
        }
    }

    public function test_each_message_fact_the_owner_commits_changes_the_owners_pages(): void
    {
        $noteId = $this->ownerSends($this->inboxIdOf($this->builder), 'The build is green.');
        $this->assertChangesPages(
            fn () => $this->runOnBus(new RequireMessageAnswer($noteId)),
            MessageAnswerRequired::class,
        );
        $this->assertChangesPages(
            fn () => $this->runOnBus(new DismissMessage($noteId, 'No longer needed.')),
            MessageDismissed::class,
        );

        $questionId = $this->takenUpByBuilder('Which port?');
        $this->asOwner();
        $claim = $this->claimsOn($questionId)[$questionId]->reference;

        $this->assertChangesPages(
            fn () => $this->runOnBus(new ReleaseMessageClaim($questionId, $claim, 'The builder is stuck.')),
            MessageClaimReleased::class,
        );
    }

    public function test_each_message_fact_an_agent_commits_changes_the_owners_pages(): void
    {
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Which port?');
        $this->asAgent($this->builder);

        $this->assertChangesPages(
            fn () => $this->runOnBus(new ReadMessages($this->inboxIdOf($this->builder), [$questionId])),
            MessageRead::class,
            MessageTakenUp::class,
        );
        $this->assertChangesPages(
            fn () => $this->runOnBus(new ReplyToMessage($questionId, null, 'Port 8080.')),
            MessageSent::class,
            MessageAnswered::class,
        );
    }

    public function test_a_reply_in_one_transaction_leaves_the_answer_and_the_owners_unread_reply(): void
    {
        $questionId = $this->takenUpByBuilder('Which port?');

        $replyId = $this->runOnBus(new ReplyToMessage($questionId, null, 'Port 8080.'));

        $question = Message::query()->acrossInboxes()->findOrFail($questionId);
        $this->assertSame([MessageState::Answered, $replyId], [$question->state, $question->answer_message_id]);
        $this->assertSame($questionId, Message::query()->acrossInboxes()->findOrFail($replyId)->reply_to_id);
        $this->asOwner();
        $this->assertSame(1, $this->app->make(ConversationResolver::class)->counts($this->ownerInboxId())->unread);
    }

    public function test_a_rolled_back_reply_changes_no_page(): void
    {
        $questionId = $this->takenUpByBuilder('Which port?');
        $before = Event::dispatched(PageChanged::class)->count();

        $this->assertThrows(
            fn () => $this->app->make(ConnectionInterface::class)->transaction(function () use ($questionId): void {
                $this->runOnBus(new ReplyToMessage($questionId, null, 'Port 8080.'));

                throw SimulatedFailure::of('The reply fails.');
            }),
            SimulatedFailure::class,
        );

        $this->assertSame($before, Event::dispatched(PageChanged::class)->count());
        $question = Message::query()->acrossInboxes()->findOrFail($questionId);
        $this->assertSame(MessageState::WaitingForAnswer, $question->state);
    }

    /**
     * Runs the write and checks it raised the facts and changed the owner's pages, with nothing in the change.
     *
     * @param  Closure(): mixed  $write
     * @param  class-string  ...$expected
     */
    private function assertChangesPages(Closure $write, string ...$expected): void
    {
        $this->facts = [];
        $before = Event::dispatched(PageChanged::class)->count();

        $write();

        foreach ($expected as $fact) {
            $this->assertContains($fact, $this->facts);
        }

        $changes = Event::dispatched(PageChanged::class)->slice($before);
        $this->assertTrue($changes->isNotEmpty());

        foreach ($changes as [$changed]) {
            $this->assertSame([], $changed->broadcastWith());
            $this->assertSame(
                ['private-'.UserChannel::nameFor($this->owner->id)],
                array_map(fn ($channel) => $channel->name, $changed->broadcastOn()),
            );
        }
    }

    private function takenUpByBuilder(string $body): string
    {
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), $body);
        $this->asAgent($this->builder);
        $this->runOnBus(new ReadMessages($this->inboxIdOf($this->builder), [$questionId]));

        return $questionId;
    }

    /**
     * @return list<class-string>
     */
    private function messageFacts(): array
    {
        return [
            MessageSent::class,
            MessageRead::class,
            MessageAnswerRequired::class,
            MessageDismissed::class,
            MessageTakenUp::class,
            MessageClaimReleased::class,
            MessageAnswered::class,
        ];
    }
}
