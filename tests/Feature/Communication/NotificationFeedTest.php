<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Data\Notifications\NotificationTarget;
use App\Enums\Notifications\NotificationSourceType;
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
        $question = $this->journal->inboxes()->openQuestionTo($this->actorOf($this->builder), 'Which port?');
        $this->deliver($question, $this->actorOf($this->builder));
        $receipt = NotificationReceipt::query()->sole();

        $this->actingAs($this->owner)
            ->post('/communication/notifications/read', ['receiptId' => $receipt->id])
            ->assertRedirect()
            ->assertSessionHasErrors();

        $this->assertNull($receipt->refresh()->read_at);
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
            $this->deliver($this->journal->inboxes()->openQuestionTo($owner, "Question {$number}?"), $owner);
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
