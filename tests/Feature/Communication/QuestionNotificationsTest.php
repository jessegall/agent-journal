<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssignmentTransaction;
use App\Communication\Commands\AskMessage;
use App\Communication\Commands\RequireMessageAnswer;
use App\Communication\Commands\SendMessage;
use App\Communication\Models\NotificationOccurrence;
use App\Communication\Models\NotificationReceipt;
use App\Communication\Models\NotificationScope;
use App\Desks\Commands\CreateDesk;
use App\Desks\Models\DeskRecord;
use App\Desks\Support\DeskSeating;
use Illuminate\Database\ConnectionInterface;
use Tests\Support\Exceptions\SimulatedFailure;
use Tests\Support\MessagingTestCase;

/**
 * A question gives each actor seated at its destination one receipt, the sender none; an ordinary send gives none
 * until it is promoted, a second promotion adds nothing, and a rolled-back ask leaves nothing.
 */
final class QuestionNotificationsTest extends MessagingTestCase
{
    protected const array TABLES = [
        ...parent::TABLES,
        'notification_receipts',
        'notification_scopes',
        'notification_occurrences',
    ];

    private DeskRecord $team;

    protected function setUp(): void
    {
        parent::setUp();

        $this->team = DeskRecord::query()->findOrFail($this->runOnBus(new CreateDesk('Team', 3, false)));

        $seated = [$this->actorOf($this->builder), $this->actorOf($this->reviewer), ActorIdentity::of($this->owner)];

        foreach ($seated as $actor) {
            $this->app->make(AssignmentTransaction::class)->run(
                fn () => $this->app->make(DeskSeating::class)->seat($this->team->id, $actor),
            );
        }
    }

    public function test_a_direct_question_gives_each_seated_recipient_one_receipt_and_the_sender_none(): void
    {
        $this->runOnBus(new AskMessage($this->ownerInboxId(), $this->team->inboxId(), 'Who takes this?'));

        $this->assertSame(1, NotificationOccurrence::query()->count());
        $this->assertSame(1, $this->unreadOf($this->actorOf($this->builder)));
        $this->assertSame(1, $this->unreadOf($this->actorOf($this->reviewer)));
        $this->assertSame(0, $this->unreadOf(ActorIdentity::of($this->owner)));
    }

    public function test_an_ordinary_send_gives_none_until_promoted_and_a_second_promotion_adds_nothing(): void
    {
        $messageId = $this->runOnBus(
            new SendMessage($this->ownerInboxId(), $this->team->inboxId(), 'The build is green.'),
        );

        $this->assertSame(0, NotificationReceipt::query()->count());

        $this->runOnBus(new RequireMessageAnswer($messageId));
        $this->runOnBus(new RequireMessageAnswer($messageId));

        $this->assertSame(1, NotificationOccurrence::query()->count());
        $this->assertSame(2, NotificationReceipt::query()->count());
        $this->assertSame(1, $this->unreadOf($this->actorOf($this->builder)));
        $this->assertSame(1, $this->unreadOf($this->actorOf($this->reviewer)));
    }

    public function test_an_ask_that_rolls_back_leaves_no_receipt(): void
    {
        $this->assertThrows(
            fn () => $this->app->make(ConnectionInterface::class)->transaction(function (): void {
                $this->runOnBus(new AskMessage($this->ownerInboxId(), $this->team->inboxId(), 'Who takes this?'));

                throw SimulatedFailure::of('The command fails after asking.');
            }),
            SimulatedFailure::class,
        );

        $this->assertSame(0, NotificationOccurrence::query()->count());
        $this->assertSame(0, NotificationReceipt::query()->count());
    }

    private function unreadOf(ActorIdentity $actor): int
    {
        return (int) NotificationScope::query()
            ->where('recipient_type', $actor->type->value)
            ->where('recipient_id', $actor->id)
            ->sum('unread_count');
    }
}
