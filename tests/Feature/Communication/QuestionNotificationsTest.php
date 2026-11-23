<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\AskMessage\AskMessageCommand;
use App\Commands\CreateDesk\CreateDeskCommand;
use App\Commands\ReleaseSeat\ReleaseSeatCommand;
use App\Commands\RequireMessageAnswer\RequireMessageAnswerCommand;
use App\Commands\SendMessage\SendMessageCommand;
use App\Contracts\Assignments\AssignmentTransaction;
use App\Models\Desks\DeskRecord;
use App\Models\Notifications\NotificationOccurrence;
use App\Models\Notifications\NotificationReceipt;
use App\Models\Notifications\NotificationScope;
use App\Support\ActorIdentity;
use App\Support\DeskSeating;
use App\Support\SeatChangeResult;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\QueryException;
use Tests\Support\MessagingTestCase;

/**
 * A question gives each actor seated at its destination one receipt, the sender none; an ordinary send gives none
 * until it is promoted, a second promotion adds nothing, and a rolled-back ask leaves nothing.
 */
final class QuestionNotificationsTest extends MessagingTestCase
{
    private const string TRIGGER_REFUSAL = 'refused for the test';

    /**
     * Refuses every receipt, so an ask fails after its message and occurrence are written.
     */
    private const string REFUSE_RECEIPT = <<<'SQL'
        CREATE FUNCTION refuse_receipt() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
            RAISE EXCEPTION 'refused for the test';
        END $$;
        CREATE TRIGGER refuse_receipt BEFORE INSERT ON notification_receipts
            FOR EACH ROW EXECUTE FUNCTION refuse_receipt();
        SQL;

    protected const array TABLES = [
        ...parent::TABLES,
        'notification_changes',
        'notification_receipts',
        'notification_scopes',
        'notification_occurrences',
    ];

    private DeskRecord $team;

    /**
     * @var array<string, SeatChangeResult>
     */
    private array $seats = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->team = DeskRecord::query()->findOrFail($this->runOnBus(new CreateDeskCommand('Team', 3, false)));

        $seated = [$this->actorOf($this->builder), $this->actorOf($this->reviewer), ActorIdentity::of($this->owner)];

        foreach ($seated as $actor) {
            $this->seats[$actor->id] = $this->app->make(AssignmentTransaction::class)->run(
                fn () => $this->app->make(DeskSeating::class)->seat($this->team->id, $actor),
            );
        }
    }

    public function test_a_direct_question_gives_each_seated_recipient_one_receipt_and_the_sender_none(): void
    {
        $this->runOnBus(new AskMessageCommand($this->ownerInboxId(), $this->team->inboxId(), 'Who takes this?'));

        $this->assertSame(1, NotificationOccurrence::query()->count());
        $this->assertSame(1, $this->unreadOf($this->actorOf($this->builder)));
        $this->assertSame(1, $this->unreadOf($this->actorOf($this->reviewer)));
        $this->assertSame(0, $this->unreadOf(ActorIdentity::of($this->owner)));
    }

    public function test_an_ordinary_send_gives_none_until_promoted_and_a_second_promotion_adds_nothing(): void
    {
        $messageId = $this->runOnBus(
            new SendMessageCommand($this->ownerInboxId(), $this->team->inboxId(), 'The build is green.'),
        );

        $this->assertSame(0, NotificationReceipt::query()->count());

        $this->runOnBus(new RequireMessageAnswerCommand($messageId));
        $this->runOnBus(new RequireMessageAnswerCommand($messageId));

        $this->assertSame(1, NotificationOccurrence::query()->count());
        $this->assertSame(2, NotificationReceipt::query()->count());
        $this->assertSame(1, $this->unreadOf($this->actorOf($this->builder)));
        $this->assertSame(1, $this->unreadOf($this->actorOf($this->reviewer)));
    }

    public function test_an_ask_that_rolls_back_leaves_no_receipt(): void
    {
        $database = $this->app->make(ConnectionInterface::class);
        $database->unprepared(self::REFUSE_RECEIPT);

        try {
            $this->assertThrows(
                fn () => $this->runOnBus(new AskMessageCommand($this->ownerInboxId(), $this->team->inboxId(), 'Who takes this?')),
                QueryException::class,
                self::TRIGGER_REFUSAL,
            );
        } finally {
            $database->unprepared('DROP TRIGGER refuse_receipt ON notification_receipts; DROP FUNCTION refuse_receipt();');
        }

        $this->assertSame(0, NotificationOccurrence::query()->count());
        $this->assertSame(0, NotificationReceipt::query()->count());
    }

    public function test_leaving_the_desk_hides_that_actors_question_receipts_and_keeps_the_others(): void
    {
        $this->runOnBus(new AskMessageCommand($this->ownerInboxId(), $this->team->inboxId(), 'Who takes this?'));
        $builder = $this->actorOf($this->builder);
        $seat = $this->seats[$builder->id];

        $this->runOnBus(new ReleaseSeatCommand($this->team->id, $seat->seatId, $seat->reference));

        $this->assertSame(0, $this->unreadOf($builder));
        $this->assertSame(1, $this->unreadOf($this->actorOf($this->reviewer)));
        $this->assertSame(1, NotificationReceipt::query()->whereNotNull('hidden_at')->count());
    }

    private function unreadOf(ActorIdentity $actor): int
    {
        return (int) NotificationScope::query()
            ->where('recipient_type', $actor->type->value)
            ->where('recipient_id', $actor->id)
            ->sum('unread_count');
    }
}
