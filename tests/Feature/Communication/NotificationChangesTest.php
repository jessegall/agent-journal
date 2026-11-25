<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Data\Notifications\NotificationTarget;
use App\Enums\Notifications\NotificationMutationType;
use App\Enums\Notifications\NotificationSourceType;
use App\Models\Notifications\NotificationChange;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use App\Resolvers\Support\NotificationChanges;
use App\Support\ActorIdentity;
use App\Support\NotificationChangeCursor;
use App\Support\NotificationChangeRetentionService;
use App\Support\NotificationDelivery;
use App\Support\NotificationReceipts;
use App\Support\NotificationScopes;
use Carbon\CarbonImmutable;
use Domain\Chat\ChatDomain;
use Domain\Questions\Models\Question;
use Domain\Questions\Values\QuestionNotificationKeys;
use Tests\Support\DomainBoot;
use Tests\Support\MessagingTestCase;

/**
 * A scope's ordered change log: arrivals read in pages of twenty through one pinned version, current read and
 * visible state on every change, reset for a cursor older than what is kept, and a purge of old rows in batches.
 */
final class NotificationChangesTest extends MessagingTestCase
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

    public function test_twenty_one_arrivals_read_in_pages_of_twenty_and_one_through_one_upper_version(): void
    {
        $start = $this->startCursor();
        $this->notifyOwner(21);

        $first = $this->changes()->since($this->owner(), $start);
        $this->notifyOwner(1);
        $second = $this->changes()->since($this->owner(), (string) $first->nextCursor);

        $this->assertCount(20, $first->changes);
        $this->assertCount(1, $second->changes);
        $this->assertNull($second->nextCursor);
    }

    public function test_a_read_receipt_shows_read_and_a_hidden_one_reads_as_a_removal(): void
    {
        $start = $this->startCursor();
        $this->notifyOwner(2);
        [$read, $hidden] = NotificationReceipt::query()->orderBy('sequence')->get()->all();
        $this->app->make(NotificationReceipts::class)->markRead($read, CarbonImmutable::now());
        $this->app->make(NotificationReceipts::class)->hide($hidden, CarbonImmutable::now());

        $page = $this->changes()->since($this->owner(), $start);
        $byReceipt = [];

        foreach ($page->changes as $change) {
            $byReceipt[$change->receiptId] = $change;
        }

        $this->assertNotNull($byReceipt[$read->id]->item->readAt);
        $this->assertSame(NotificationMutationType::Remove, $byReceipt[$hidden->id]->type);
    }

    public function test_a_cursor_older_than_the_kept_changes_answers_reset(): void
    {
        $start = $this->startCursor();
        $this->notifyOwner(2);
        NotificationChange::query()->where('version', 1)->delete();

        $this->assertTrue($this->changes()->since($this->owner(), $start)->isReset);
    }

    public function test_the_purge_deletes_changes_older_than_a_day(): void
    {
        $this->notifyOwner(3);
        NotificationChange::query()->update(['created_at' => CarbonImmutable::now()->subHours(25)]);

        $this->assertSame(
            3,
            $this->app->make(NotificationChangeRetentionService::class)->prune(CarbonImmutable::now()),
        );
        $this->assertSame(0, NotificationChange::query()->count());
    }

    private function startCursor(): string
    {
        $this->notifyOwner(0);
        $scope = NotificationScope::query()->sole();

        return NotificationChangeCursor::at($scope->id, 0, 0)->text();
    }

    private function notifyOwner(int $count): void
    {
        $owner = $this->owner();

        if ($count === 0) {
            NotificationScope::create(NotificationScopes::JOURNAL, $owner);

            return;
        }

        for ($number = 1; $number <= $count; $number++) {
            $question = $this->journal->inboxes()->openQuestionTo($owner, "Question {$number}?");
            $this->deliver($question, $owner);
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

    private function owner(): ActorIdentity
    {
        return ActorIdentity::of($this->owner);
    }

    private function changes(): NotificationChanges
    {
        return $this->app->make(NotificationChanges::class);
    }
}
