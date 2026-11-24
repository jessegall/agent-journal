<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Data\Notifications\NotificationTarget;
use App\Enums\NotificationSourceType;
use App\Models\Notifications\NotificationOccurrence;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use App\Support\ActorIdentity;
use App\Support\NotificationDelivery;
use App\Support\NotificationReceipts;
use App\Support\NotificationScopes;
use Carbon\CarbonImmutable;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\TestCase;

/**
 * One occurrence per key and one receipt per distinct recipient; a replay adds nothing, and a receipt read twice
 * lowers its scope's count once and keeps its first read time.
 */
final class NotificationDeliveryTest extends TestCase
{
    use RefreshHookDatabase;

    private ActorIdentity $alex;

    private ActorIdentity $jo;

    protected function setUp(): void
    {
        parent::setUp();

        $this->alex = TestActors::userIdentity(1);
        $this->jo = TestActors::userIdentity(2);
    }

    public function test_delivering_the_same_occurrence_twice_leaves_one_occurrence_and_one_receipt_each(): void
    {
        $this->deliver([$this->alex, $this->jo, $this->jo]);
        $this->deliver([$this->jo, $this->alex]);

        $this->assertSame(1, NotificationOccurrence::query()->count());
        $this->assertSame(2, NotificationReceipt::query()->count());
        $this->assertSame(1, $this->scopeOf($this->alex)->unread_count);
        $this->assertSame(1, $this->scopeOf($this->jo)->unread_count);
    }

    public function test_each_new_receipt_takes_its_scope_s_next_sequence(): void
    {
        $this->deliver([$this->jo], 'question:1');
        $this->deliver([$this->jo], 'question:2');

        $sequences = NotificationReceipt::query()->orderBy('sequence')->pluck('sequence')->all();

        $this->assertSame([1, 2], $sequences);
        $this->assertSame(3, $this->scopeOf($this->jo)->next_sequence);
        $this->assertSame(2, $this->scopeOf($this->jo)->unread_count);
    }

    public function test_marking_a_receipt_read_twice_lowers_the_count_once_and_keeps_the_first_read_time(): void
    {
        $this->deliver([$this->alex, $this->jo]);
        $receipt = $this->receiptOf($this->jo);
        $first = CarbonImmutable::parse('2026-11-21 10:00:00');

        $this->assertTrue($this->app->make(NotificationReceipts::class)->markRead($receipt, $first));
        $this->assertFalse(
            $this->app->make(NotificationReceipts::class)->markRead($receipt, $first->addMinute()),
        );

        $this->assertSame(0, $this->scopeOf($this->jo)->unread_count);
        $this->assertSame(1, $this->scopeOf($this->alex)->unread_count);
        $this->assertTrue($first->equalTo($this->receiptOf($this->jo)->read_at));
    }

    public function test_a_hidden_receipt_never_counts_and_counts_again_when_revealed_unread(): void
    {
        $this->deliver([$this->jo]);
        $receipts = $this->app->make(NotificationReceipts::class);
        $at = CarbonImmutable::now();

        $this->assertTrue($receipts->hide($this->receiptOf($this->jo), $at));
        $this->assertFalse($receipts->hide($this->receiptOf($this->jo), $at));
        $this->assertSame(0, $this->scopeOf($this->jo)->unread_count);

        $this->assertTrue($receipts->markRead($this->receiptOf($this->jo), $at));
        $this->assertSame(0, $this->scopeOf($this->jo)->unread_count);

        $this->assertTrue($receipts->reveal($this->receiptOf($this->jo)));
        $this->assertSame(0, $this->scopeOf($this->jo)->unread_count);
        $this->assertSame(4, $this->scopeOf($this->jo)->mutation_version);
    }

    /**
     * @param  list<ActorIdentity>  $recipients
     */
    private function deliver(array $recipients, string $key = 'question:73'): void
    {
        $this->app->make(NotificationDelivery::class)->deliver(
            $key,
            NotificationSourceType::Question,
            new NotificationTarget('chat.question', '73'),
            $recipients,
        );
    }

    private function scopeOf(ActorIdentity $recipient): NotificationScope
    {
        return NotificationScope::lockedFor($this->app->make(NotificationScopes::class)->keyFor($recipient), $recipient);
    }

    private function receiptOf(ActorIdentity $recipient): NotificationReceipt
    {
        return NotificationReceipt::query()->where('scope_id', $this->scopeOf($recipient)->id)->sole();
    }
}
