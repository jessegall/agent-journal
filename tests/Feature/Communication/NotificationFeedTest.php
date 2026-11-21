<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorIdentity;
use App\Communication\Data\NotificationTarget;
use App\Communication\Enums\NotificationSourceType;
use App\Communication\Models\Message;
use App\Communication\Models\NotificationReceipt;
use App\Communication\Resolvers\QuestionNotificationTarget;
use App\Communication\Support\NotificationDelivery;
use Tests\Support\MessagingTestCase;

/**
 * The bell's server side: the newest twenty receipts with the scope's own count, the next page by its cursor, a mark
 * that counts once, and nothing of another actor's receipts or of a question the reader may no longer see.
 */
final class NotificationFeedTest extends MessagingTestCase
{
    protected const array TABLES = [
        ...parent::TABLES,
        'notification_receipts',
        'notification_scopes',
        'notification_occurrences',
    ];

    public function test_the_first_page_holds_the_newest_twenty_and_the_cursor_reaches_the_twenty_first_once(): void
    {
        $this->notifyOwner(21);

        $first = $this->actingAs($this->owner)->getJson('/communication/notifications')->assertOk();

        $this->assertCount(20, $first->json('items'));
        $this->assertSame(21, $first->json('unread'));
        $this->assertSame('21', $first->json('through'));
        $this->assertSame(21, $first->json('items.0.sequence'));
        $this->assertSame(QuestionNotificationTarget::KEY, $first->json('items.0.target.key'));

        $second = $this->actingAs($this->owner)
            ->getJson('/communication/notifications?'.http_build_query(['cursor' => $first->json('nextCursor')]))
            ->assertOk();

        $this->assertSame([1], array_column($second->json('items'), 'sequence'));
        $this->assertNull($second->json('nextCursor'));
    }

    public function test_marking_a_receipt_read_twice_lowers_the_count_once(): void
    {
        $this->notifyOwner(2);
        $receiptId = NotificationReceipt::query()->where('sequence', 2)->sole()->id;

        $this->actingAs($this->owner)
            ->postJson('/communication/notifications/read', ['receiptId' => $receiptId])
            ->assertOk()
            ->assertJsonPath('unread', 1);

        $this->actingAs($this->owner)
            ->postJson('/communication/notifications/read', ['receiptId' => $receiptId])
            ->assertOk()
            ->assertJsonPath('unread', 1);
    }

    public function test_another_actors_receipt_answers_unavailable_and_changes_nothing(): void
    {
        $message = $this->askInboxOf($this->actorOf($this->builder), 'Which port?');
        $this->deliver($message, $this->actorOf($this->builder));
        $receipt = NotificationReceipt::query()->sole();

        $this->actingAs($this->owner)
            ->postJson('/communication/notifications/read', ['receiptId' => $receipt->id])
            ->assertNotFound();

        $this->assertNull($receipt->refresh()->read_at);
    }

    public function test_a_question_the_reader_can_no_longer_see_drops_out_of_the_page(): void
    {
        $this->notifyOwner(1);
        $this->deliver($this->askNobody('Out of sight.'), ActorIdentity::of($this->owner));

        $page = $this->actingAs($this->owner)->getJson('/communication/notifications')->assertOk();

        $this->assertSame([1], array_column($page->json('items'), 'sequence'));
    }

    public function test_a_cursor_of_another_scope_is_refused(): void
    {
        $this->notifyOwner(21);
        $cursor = $this->actingAs($this->owner)->getJson('/communication/notifications')->json('nextCursor');
        $forged = rtrim(strtr(base64_encode('01jd8x0g9m3qz6v4k2t7r5w1ce.'.'5'), '+/', '-_'), '=');

        $this->assertIsString($cursor);
        $this->actingAs($this->owner)
            ->getJson('/communication/notifications?'.http_build_query(['cursor' => $forged]))
            ->assertStatus(422);
    }

    private function notifyOwner(int $count): void
    {
        $owner = ActorIdentity::of($this->owner);

        for ($number = 1; $number <= $count; $number++) {
            $this->deliver($this->askInboxOf($owner, "Question {$number}?"), $owner);
        }
    }

    private function deliver(Message $message, ActorIdentity $recipient): void
    {
        $this->app->make(NotificationDelivery::class)->deliver(
            QuestionNotificationTarget::occurrenceKey($message->id),
            NotificationSourceType::Question,
            new NotificationTarget(QuestionNotificationTarget::KEY, $message->id),
            [$recipient],
        );
    }
}
