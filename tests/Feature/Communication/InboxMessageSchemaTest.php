<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Enums\MessageState;
use App\Enums\MessageType;
use App\Models\CommandReceipt;
use App\Models\GlobalGroup;
use App\Models\Message;
use App\Support\AcceptedOperation;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use App\Support\AssignmentReference;
use App\Support\DeskOpening;
use App\Support\InboxMembership;
use App\Support\MessageBody;
use App\Support\MessageEnvelope;
use App\Support\ReceiptCaller;
use App\Support\ReceiptRetention;
use Carbon\CarbonImmutable;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use stdClass;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The final messages table: each check refuses a row that breaks it, the first reader is kept, and a change against
 * a stale state version is refused.
 */
final class InboxMessageSchemaTest extends TestCase
{
    use RefreshHookDatabase;

    private ActorIdentity $author;

    protected function setUp(): void
    {
        parent::setUp();

        GlobalGroup::installJournal();
        $this->author = TestActors::agentIdentity(7);
    }

    public function test_acknowledging_twice_keeps_the_first_reader(): void
    {
        $message = $this->ask();
        $first = InboxMembership::atDeskSeat($this->author, new AssignmentReference(TestIds::of(1), $this->holder()));
        $second = InboxMembership::atDeskSeat(
            TestActors::agentIdentity(8),
            new AssignmentReference(TestIds::of(2), $this->holder()),
        );

        $this->assertTrue($message->acknowledge($first, CarbonImmutable::now()));
        $this->assertFalse($message->acknowledge($second, CarbonImmutable::now()));

        $this->assertSame([$this->author->id, 0], [$message->refresh()->read_by_id, $message->state_version]);
    }

    public function test_answering_a_stale_version_is_refused_and_each_check_holds(): void
    {
        $message = $this->ask();
        $reply = $this->ask();
        $message->answerWith($reply, $this->author, CarbonImmutable::now());

        $this->assertSame([MessageState::Answered, 1], [$message->state, $message->state_version]);
        $this->assertFalse($message->isAtStateVersion(0));
        $this->assertThrows(
            fn () => DB::table('messages')->whereKey($reply->id)->update(['read_at' => now()]),
            QueryException::class,
        );
        $this->assertThrows(
            fn () => DB::table('messages')->whereKey($reply->id)->update(['state' => 'answered']),
            QueryException::class,
        );
        $this->assertThrows(
            fn () => DB::table('messages')->whereKey($reply->id)->update(['state' => 'dismissed']),
            QueryException::class,
        );
    }

    public function test_a_desk_row_is_typed_desk_and_a_chat_row_with_a_read_audit_is_refused(): void
    {
        $message = $this->ask();

        $this->assertSame(MessageType::Desk, $message->refresh()->message_type);

        $eventId = (string) str()->ulid();
        DB::table('inbox_timeline_events')->insert([
            'id' => $eventId,
            'inbox_id' => $message->source_inbox_id,
            'sequence' => 1,
            'type' => 'message',
            'actor_type' => $this->author->type->value,
            'actor_id' => $this->author->id,
            'created_at' => now(),
        ]);

        $this->assertThrows(
            fn () => DB::table('messages')->whereKey($message->id)->update([
                'message_type' => MessageType::Chat->value,
                'destination_inbox_id' => $message->source_inbox_id,
                'timeline_event_id' => $eventId,
                'read_at' => now(),
                'read_by_type' => $this->author->type->value,
                'read_by_id' => $this->author->id,
                'read_participation_assignment_id' => TestIds::of(1),
            ]),
            QueryException::class,
        );
        $this->assertThrows(
            fn () => DB::table('messages')->whereKey($message->id)->update(['timeline_event_id' => $eventId]),
            QueryException::class,
        );
    }

    private function ask(): Message
    {
        $receipt = CommandReceipt::create(
            ReceiptCaller::withoutSession(ActorContext::forAgent(TestIds::of(7))),
            (string) str()->ulid(),
            new stdClass(),
            ReceiptRetention::standard(),
        );
        $envelope = MessageEnvelope::ask(
            $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'From'),
            $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'To'),
            $this->author,
            MessageBody::from('Can you look?'),
        );

        return Message::create($envelope, new AcceptedOperation($receipt->id));
    }

    private function holder(): AssigneeIdentity
    {
        return AssigneeIdentity::ofActorIdentity($this->author);
    }
}
