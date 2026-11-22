<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorIdentity;
use App\Communication\Data\NotificationTarget;
use App\Communication\Enums\NotificationSourceType;
use App\Communication\Models\NotificationReceipt;
use App\Communication\Models\NotificationScope;
use App\Communication\Support\NotificationDelivery;
use App\Communication\Support\NotificationReceipts;
use Carbon\CarbonImmutable;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Mark all reads every unread receipt up to the watermark the reader saw, two hundred per batch, and resumes an
 * interrupted run from where its scope says it reached; later receipts stay unread.
 */
final class MarkAllNotificationsTest extends TestCase
{
    use RefreshHookDatabase;

    private ActorIdentity $jo;

    protected function setUp(): void
    {
        parent::setUp();

        $this->jo = TestActors::userIdentity(2);
    }

    public function test_receipts_after_the_watermark_stay_unread(): void
    {
        $this->deliver(1, 104);
        $this->deliver(105, 105);

        $this->assertTrue($this->receipts()->markAllThrough($this->jo, 104, CarbonImmutable::now()));
        $this->deliver(106, 106);

        $this->assertSame(2, $this->scope()->unread_count);
        $this->assertSame(
            [105, 106],
            NotificationReceipt::query()->whereNull('read_at')->orderBy('sequence')->pluck('sequence')->all(),
        );
    }

    #[TimeLimit(seconds: 6, reason: 'It delivers 450 notifications through the real delivery, one occurrence each.')]
    public function test_four_hundred_fifty_unread_clear_in_three_batches_and_an_interrupted_run_resumes(): void
    {
        $this->deliver(1, 450);

        $this->assertFalse($this->receipts()->markAllThrough($this->jo, 450, CarbonImmutable::now()));
        $this->assertSame(200, $this->scope()->mark_all_after);
        $this->assertSame(250, $this->scope()->unread_count);

        $this->assertFalse($this->receipts()->markAllThrough($this->jo, 450, CarbonImmutable::now()));
        $this->assertTrue($this->receipts()->markAllThrough($this->jo, 450, CarbonImmutable::now()));

        $this->assertSame(0, $this->scope()->unread_count);
        $this->assertNull($this->scope()->mark_all_through);
    }

    private function deliver(int $first, int $last): void
    {
        for ($number = $first; $number <= $last; $number++) {
            $this->app->make(NotificationDelivery::class)->deliver(
                "question:{$number}",
                NotificationSourceType::Question,
                new NotificationTarget('chat.question', (string) $number),
                [$this->jo],
            );
        }
    }

    private function scope(): NotificationScope
    {
        return NotificationScope::query()->sole();
    }

    private function receipts(): NotificationReceipts
    {
        return $this->app->make(NotificationReceipts::class);
    }
}
