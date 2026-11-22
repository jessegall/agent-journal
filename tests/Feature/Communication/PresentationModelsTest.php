<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorContext;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\ReceiptCaller;
use App\Bus\Support\ReceiptRetention;
use App\Communication\Enums\IntervalRole;
use App\Communication\Enums\OutstandingRangeState;
use App\Communication\Enums\PresentationBatchState;
use App\Communication\Exceptions\ChatStateConflict;
use App\Communication\Models\InboxInterval;
use App\Communication\Models\InboxRecord;
use App\Communication\Models\Message;
use App\Communication\Models\MessageReceipt;
use App\Communication\Models\OutstandingRange;
use App\Communication\Models\PresentationBatch;
use App\Communication\Models\PresentationRange;
use App\Communication\Models\ReceiptProgress;
use App\Communication\Support\AcceptedOperation;
use App\Communication\Support\MessageBody;
use App\Communication\Support\MessageEnvelope;
use App\Communication\Support\PresentationAcknowledgement;
use App\Desks\Support\DeskOpening;
use App\Numbers\Models\GlobalGroup;
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
final class PresentationModelsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_batch_confirms_a_range_settles_once_and_a_retry_keeps_the_range_identity(): void
    {
        GlobalGroup::installJournal();
        $inbox = InboxRecord::create('test-chat', (string) str()->ulid());
        $interval = InboxInterval::create($inbox->id, TestActors::agentIdentity(7), IntervalRole::Member, 1);
        $receipt = MessageReceipt::forAudience($this->message(), [$interval], TestIds::of(9))[0];
        $now = CarbonImmutable::now();

        $batch = PresentationBatch::create(
            $interval->id,
            TestIds::of(5),
            1,
            'thread-1',
            1,
            $now,
            $now->addMinute(),
        );
        $first = OutstandingRange::create($receipt, 0);
        $second = OutstandingRange::create($receipt, 100);
        PresentationRange::create($batch, $first, 100, hash('sha256', 'one'));
        PresentationRange::create($batch, $second, 180, hash('sha256', 'two'));

        $acknowledgement = $this->app->make(PresentationAcknowledgement::class);
        $this->assertNotNull($acknowledgement->confirm($batch, hash('sha256', 'one'), $now));
        $this->assertNull($acknowledgement->confirm($batch, hash('sha256', 'one'), $now));
        $this->assertSame(100, ReceiptProgress::confirmedOffsetOf($receipt->id, 'thread-1'));
        $this->assertSame(OutstandingRangeState::Confirmed, $first->refresh()->state);

        $batch->settle(PresentationBatchState::Failed, $now);
        $this->assertThrows(
            fn () => $acknowledgement->confirm($batch, hash('sha256', 'two'), $now),
            ChatStateConflict::class,
        );

        $this->assertSame($second->id, OutstandingRange::waitingAt($receipt, 100)?->id);
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
            $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'From'),
            $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'To'),
            TestActors::agentIdentity(7),
            MessageBody::from('Hello.'),
        );

        return Message::create($envelope, new AcceptedOperation($operation->id));
    }
}
