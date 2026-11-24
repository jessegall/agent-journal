<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Enums\IntervalRole;
use App\Enums\MessageBatchState;
use App\Enums\OutstandingMessageRangeState;
use App\Exceptions\ChatStateConflict;
use App\Models\Chats\InboxInterval;
use App\Models\Inboxes\Inbox;
use App\Models\CommandRules\CommandReceipt;
use App\Models\Messages\Message;
use App\Models\Messages\MessageBatch;
use App\Models\Messages\MessageRange;
use App\Models\Messages\MessageReceipt;
use App\Models\Messages\OutstandingMessageRange;
use App\Models\Messages\ReceiptProgress;
use App\Models\Records\GlobalGroup;
use App\Support\AcceptedOperation;
use App\Support\ActorContext;
use App\Support\DeskService;
use App\Support\MessageBatchService;
use App\Support\MessageBody;
use App\Support\MessageEnvelope;
use App\Support\ReceiptCaller;
use App\Support\ReceiptRetention;
use Carbon\CarbonImmutable;
use stdClass;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A batch presents two pieces of a body, one is confirmed and moves the context's progress, a settled batch takes no
 * more confirmations, and the piece presented again in a retry keeps its outstanding identity.
 */
final class MessageBatchModelsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_batch_confirms_a_range_settles_once_and_a_retry_keeps_the_range_identity(): void
    {
        GlobalGroup::installJournal();
        $inbox = Inbox::create('test-chat', (string) str()->ulid());
        $interval = InboxInterval::create($inbox->id, TestActors::agentIdentity(7), IntervalRole::Member, 1);
        $receipt = MessageReceipt::forAudience($this->message(), [$interval], TestIds::of(9))[0];
        $now = CarbonImmutable::now();

        $batch = MessageBatch::create(
            $interval->id,
            TestIds::of(5),
            1,
            'thread-1',
            1,
            $now,
            $now->addMinute(),
        );
        $first = OutstandingMessageRange::create($receipt, 0);
        $second = OutstandingMessageRange::create($receipt, 100);
        MessageRange::create($batch, $first, 100, hash('sha256', 'one'));
        MessageRange::create($batch, $second, 180, hash('sha256', 'two'));

        $acknowledgement = $this->app->make(MessageBatchService::class);
        $this->assertNotNull($acknowledgement->confirm($batch, hash('sha256', 'one'), $now));
        $this->assertNull($acknowledgement->confirm($batch, hash('sha256', 'one'), $now));
        $this->assertSame(100, ReceiptProgress::confirmedOffsetOf($receipt->id, 'thread-1'));
        $this->assertSame(OutstandingMessageRangeState::Confirmed, $first->refresh()->state);

        $batch->settle(MessageBatchState::Failed, $now);
        $this->assertThrows(
            fn () => $acknowledgement->confirm($batch, hash('sha256', 'two'), $now),
            ChatStateConflict::class,
        );

        $this->assertSame($second->id, OutstandingMessageRange::waitingAt($receipt, 100)?->id);
    }

    private function message(): Message
    {
        $operation = CommandReceipt::create(
            ReceiptCaller::withoutSession(ActorContext::forAgent(TestIds::of(7))),
            (string) str()->ulid(),
            new stdClass(),
            ReceiptRetention::standard(),
        );
        $envelope = MessageEnvelope::send(
            $this->app->make(DeskService::class)->openSourceDesk((string) str()->ulid(), 'From'),
            $this->app->make(DeskService::class)->openSourceDesk((string) str()->ulid(), 'To'),
            TestActors::agentIdentity(7),
            MessageBody::from('Hello.'),
        );

        return Message::create($envelope, new AcceptedOperation($operation->id));
    }
}
