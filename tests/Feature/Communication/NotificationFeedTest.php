<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Data\Notifications\NotificationTarget;
use App\Enums\Notifications\NotificationSourceType;
use App\Http\Responses\NotificationProps;
use App\Models\Notifications\NotificationReceipt;
use App\Support\ActorIdentity;
use App\Support\NotificationDelivery;
use Domain\Chat\ChatDomain;
use Domain\Questions\Models\Question;
use Domain\Questions\Values\QuestionNotificationKeys;
use Illuminate\Testing\TestResponse;
use Tests\Support\DomainBoot;
use Tests\Support\MessagingTestCase;

/**
 * The bell's server side: the newest twenty receipts with the scope's own count, the next page by its cursor, a mark
 * that counts once, and nothing of another actor's receipts or of a question the reader may no longer see.
 */
final class NotificationFeedTest extends MessagingTestCase
{
    protected const array TABLES = [
        ...parent::TABLES,
        'notification_changes',
        'notification_receipts',
        'notification_scopes',
        'notification_occurrences',
    ];

    /**
     * Chat and the Questions it needs beside core: a question is what these notifications are about, and Chat
     * links each to its chat.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(ChatDomain::class);
    }

    public function test_the_first_page_holds_the_newest_twenty_and_the_cursor_reaches_the_twenty_first_once(): void
    {
        $this->notifyOwner(21);

        $first = $this->actingAs($this->owner)->notifications()->assertOk();

        $this->assertCount(20, $first->json('props.notifications.items'));
        $this->assertSame(21, $first->json('props.notifications.unread'));
        $this->assertSame('21', $first->json('props.notifications.through'));
        $this->assertSame(21, $first->json('props.notifications.items.0.sequence'));
        $this->assertSame(QuestionNotificationKeys::target(), $first->json('props.notifications.items.0.target.key'));

        $second = $this->actingAs($this->owner)
            ->notifications([NotificationProps::CURSOR => $first->json('props.notifications.nextCursor')])
            ->assertOk();

        $this->assertSame([1], array_column($second->json('props.notifications.items'), 'sequence'));
        $this->assertNull($second->json('props.notifications.nextCursor'));
    }

    public function test_marking_a_receipt_read_twice_lowers_the_count_once(): void
    {
        $this->notifyOwner(2);
        $receiptId = NotificationReceipt::query()->where('sequence', 2)->sole()->id;

        $markRead = fn () => $this->actingAs($this->owner)->from('/chat')
            ->post('/communication/notifications/read', ['receiptId' => $receiptId])
            ->assertRedirect('/chat');

        $markRead();
        $this->assertSame(1, $this->notifications()->json('props.notifications.unread'));
        $markRead();
        $this->assertSame(1, $this->notifications()->json('props.notifications.unread'));
    }

    public function test_another_actors_receipt_is_refused_and_changes_nothing(): void
    {
        $question = $this->askInboxOf($this->actorOf($this->builder), 'Which port?');
        $this->deliver($question, $this->actorOf($this->builder));
        $receipt = NotificationReceipt::query()->sole();

        $this->actingAs($this->owner)
            ->post('/communication/notifications/read', ['receiptId' => $receipt->id])
            ->assertRedirect()
            ->assertSessionHasErrors();

        $this->assertNull($receipt->refresh()->read_at);
    }

    public function test_a_question_the_reader_can_no_longer_see_drops_out_of_the_page(): void
    {
        $this->notifyOwner(1);
        $this->deliver($this->askNobody('Out of sight.'), ActorIdentity::of($this->owner));

        $page = $this->actingAs($this->owner)->notifications()->assertOk();

        $this->assertSame([1], array_column($page->json('props.notifications.items'), 'sequence'));
    }

    public function test_a_cursor_of_another_scope_is_refused(): void
    {
        $this->notifyOwner(21);
        $cursor = $this->actingAs($this->owner)->notifications()->json('props.notifications.nextCursor');
        $forged = rtrim(strtr(base64_encode('01jd8x0g9m3qz6v4k2t7r5w1ce.'.'5'), '+/', '-_'), '=');

        $this->assertIsString($cursor);
        $this->actingAs($this->owner)
            ->notifications([NotificationProps::CURSOR => $forged])
            ->assertStatus(422);
    }

    /**
     * The shell's notifications as the bell reads them: a partial reload of the chat page that names only them.
     *
     * @param  array<string, mixed>  $query
     */
    private function notifications(array $query = []): TestResponse
    {
        $page = $this->get('/chat')->viewData('page');

        return $this->get('/chat?'.http_build_query($query), [
            'X-Inertia' => 'true',
            'X-Inertia-Version' => $page['version'],
            'X-Inertia-Partial-Component' => $page['component'],
            'X-Inertia-Partial-Data' => 'notifications',
        ]);
    }

    private function notifyOwner(int $count): void
    {
        $owner = ActorIdentity::of($this->owner);

        for ($number = 1; $number <= $count; $number++) {
            $this->deliver($this->askInboxOf($owner, "Question {$number}?"), $owner);
        }
    }

    private function deliver(Question $question, ActorIdentity $recipient): void
    {
        $this->app->make(NotificationDelivery::class)->deliver(
            QuestionNotificationKeys::occurrenceKey($question->id),
            NotificationSourceType::Question,
            new NotificationTarget(QuestionNotificationKeys::target(), $question->id),
            [$recipient],
        );
    }
}
