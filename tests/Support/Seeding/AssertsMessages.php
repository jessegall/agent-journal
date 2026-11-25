<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Data\Notifications\NotificationTarget;
use App\Enums\Notifications\NotificationSourceType;
use App\Models\Inboxes\Inbox;
use App\Models\Messages\Message;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use App\Resolvers\RunNotificationTarget;
use App\Support\ActorIdentity;
use App\Support\NotificationDelivery;
use App\Support\NotificationScopes;
use PHPUnit\Framework\Assert;
use Tests\Support\Seeding\Exceptions\FixtureRefused;

/**
 * The messages and notifications a test arranges and asserts through the journal fixture: a message is found by its
 * exact inbox, sender and body, and a notification by the one receipt the named recipient got, never by every receipt
 * there is.
 */
trait AssertsMessages
{
    /**
     * @var array<string, NotificationReceipt>
     */
    private array $notifications = [];

    /**
     * So many messages with exactly this body were sent to the inbox by the user or agent of this name.
     */
    public function assertMessageSent(Inbox $inbox, string $from, string $body, int $count = 1): self
    {
        $sent = Message::query()
            ->inInbox($inbox->id)
            ->whereSender($this->agents[$from] ?? $this->userCalled($from))
            ->where('body', $body)
            ->count();

        Assert::assertSame($count, $sent, "{$from} sent that body to the inbox a different number of times.");

        return $this;
    }

    /**
     * A notification of the occurrence delivered to the user or agent of this name through the real delivery, kept
     * under a name as the one receipt that recipient got.
     */
    private function notification(
        string $name,
        string $recipient,
        string $occurrenceKey,
        NotificationSourceType $source,
        NotificationTarget $target,
    ): self {
        $actor = $this->actorCalled($recipient);
        $this->app->make(NotificationDelivery::class)->deliver($occurrenceKey, $source, $target, [$actor]);
        $receipt = NotificationReceipt::findForTarget($this->scopeOf($actor)->id, $target->key, $target->id)->get();

        return $this->rememberNotification($name, $receipt);
    }

    /**
     * Notifications of the runs numbered first to last delivered to the recipient, each kept as "Run <n>".
     */
    public function notifyRunOutcomes(string $recipient, int $first, int $last): self
    {
        for ($number = $first; $number <= $last; $number++) {
            $this->notification(
                "Run {$number}",
                $recipient,
                "run:{$number}",
                NotificationSourceType::RunOutcome,
                new NotificationTarget(RunNotificationTarget::KEY, (string) $number),
            );
        }

        return $this;
    }

    private function rememberNotification(string $name, NotificationReceipt $receipt): self
    {
        if (array_key_exists($name, $this->notifications)) {
            throw FixtureRefused::occupiedAlias($name, 'notification');
        }

        $this->notifications[$name] = $receipt;

        return $this;
    }

    public function notificationCalled(string $name): NotificationReceipt
    {
        $receipt = $this->notifications[$name] ?? throw FixtureRefused::missingAlias(
            'notification',
            $name,
            self::OWNER,
        );

        return $receipt->fresh();
    }

    public function assertNotificationRead(string $name): self
    {
        Assert::assertNotNull($this->notificationCalled($name)->read_at, "The notification {$name} is unread.");

        return $this;
    }

    public function assertNotificationUnread(string $name): self
    {
        Assert::assertNull($this->notificationCalled($name)->read_at, "The notification {$name} is read.");

        return $this;
    }

    /**
     * The unread count the user or agent of this name sees, as its notification scope keeps it.
     */
    public function assertUnreadNotifications(string $recipient, int $count): self
    {
        $unread = $this->scopeOf($this->actorCalled($recipient))->unread_count;

        Assert::assertSame($count, $unread, "{$recipient} sees a different unread count.");

        return $this;
    }

    private function scopeOf(ActorIdentity $actor): NotificationScope
    {
        return NotificationScope::findFor($this->app->make(NotificationScopes::class)->keyFor($actor), $actor)->get();
    }
}
