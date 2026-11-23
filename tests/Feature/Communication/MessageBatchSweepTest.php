<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Enums\IntervalRole;
use App\Enums\MessageBatchState;
use App\Enums\OutstandingMessageRangeState;
use App\Models\Chats\InboxInterval;
use App\Models\Chats\InboxRecord;
use App\Models\CommandRules\CommandReceipt;
use App\Models\Messages\Message;
use App\Models\Messages\MessageBatch;
use App\Models\Messages\MessageRange;
use App\Models\Messages\MessageReceipt;
use App\Models\Messages\OutstandingMessageRange;
use App\Models\Records\GlobalGroup;
use App\Support\AcceptedOperation;
use App\Support\ActorContext;
use App\Support\DeskOpening;
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
 * An attempt with no confirmation in time settles once and counts a failure only on the pieces it left unconfirmed;
 * five such failures in a row give the piece up.
 */
final class MessageBatchSweepTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_only_the_unconfirmed_suffix_counts_failures_and_is_exhausted_after_five(): void
    {
        GlobalGroup::installJournal();
        $inbox = InboxRecord::create('test-chat', (string) str()->ulid());
        $interval = InboxInterval::create($inbox->id, TestActors::agentIdentity(7), IntervalRole::Member, 1);
        $receipt = MessageReceipt::forAudience($this->message(), [$interval], TestIds::of(9))[0];
        $start = CarbonImmutable::now();
        $prefix = OutstandingMessageRange::create($receipt, 0);
        $sweep = $this->app->make(MessageBatchService::class);

        foreach (range(1, 5) as $attempt) {
            $at = $start->addMinutes($attempt * 10);
            $batch = MessageBatch::create($interval->id, TestIds::of(5), 1, 'thread-1', $attempt, $at, $at);
            $suffix = OutstandingMessageRange::waitingAt($receipt, 100) ?? OutstandingMessageRange::create($receipt, 100);
            MessageRange::create($batch, $suffix, 200, hash('sha256', "suffix-{$attempt}"));

            $sweep->sweep($at->addMinutes(5));

            $this->assertSame(MessageBatchState::Expired, $batch->refresh()->state);
        }

        $this->assertSame(0, $prefix->refresh()->consecutive_failures);
        $this->assertSame(OutstandingMessageRangeState::Exhausted, $suffix->refresh()->state);
    }

    private function message(): Message
    {
        $operation = CommandReceipt::create(
            ReceiptCaller::withoutSession(ActorContext::forAgent(TestIds::of(8))),
            (string) str()->ulid(),
            new stdClass(),
            ReceiptRetention::standard(),
        );
        $envelope = MessageEnvelope::send(
            $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'From'),
            $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'To'),
            TestActors::agentIdentity(8),
            MessageBody::from(str_repeat('a', 200)),
        );

        return Message::create($envelope, new AcceptedOperation($operation->id));
    }
}
