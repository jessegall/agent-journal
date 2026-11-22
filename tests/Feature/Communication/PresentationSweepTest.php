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
use App\Communication\Models\InboxInterval;
use App\Communication\Models\InboxRecord;
use App\Communication\Models\Message;
use App\Communication\Models\MessageReceipt;
use App\Communication\Models\OutstandingRange;
use App\Communication\Models\PresentationBatch;
use App\Communication\Models\PresentationRange;
use App\Communication\Support\AcceptedOperation;
use App\Communication\Support\MessageBody;
use App\Communication\Support\MessageEnvelope;
use App\Communication\Support\PresentationSweep;
use App\Desks\Support\DeskOpening;
use App\Numbers\Models\GlobalGroup;
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
final class PresentationSweepTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_only_the_unconfirmed_suffix_counts_failures_and_is_exhausted_after_five(): void
    {
        GlobalGroup::installJournal();
        $inbox = InboxRecord::create('test-chat', (string) str()->ulid());
        $interval = InboxInterval::create($inbox->id, TestActors::agentIdentity(7), IntervalRole::Member, 1);
        $receipt = MessageReceipt::forAudience($this->message(), [$interval], TestIds::of(9))[0];
        $start = CarbonImmutable::now();
        $prefix = OutstandingRange::create($receipt, 0);
        $sweep = $this->app->make(PresentationSweep::class);

        foreach (range(1, 5) as $attempt) {
            $at = $start->addMinutes($attempt * 10);
            $batch = PresentationBatch::create($interval->id, TestIds::of(5), 1, 'thread-1', $attempt, $at, $at);
            $suffix = OutstandingRange::create($receipt, 100);
            PresentationRange::create($batch, $suffix, 200, hash('sha256', "suffix-{$attempt}"));

            $sweep->sweep($at->addMinutes(5));

            $this->assertSame(PresentationBatchState::Expired, $batch->refresh()->state);
        }

        $this->assertSame(0, $prefix->refresh()->consecutive_failures);
        $this->assertSame(OutstandingRangeState::Exhausted, $suffix->refresh()->state);
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
