<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AssigneeIdentity;
use App\Assignments\Support\AssignmentReference;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\ReceiptCaller;
use App\Bus\Support\ReceiptRetention;
use App\Communication\Enums\MessageState;
use App\Communication\Models\Message;
use App\Communication\Support\AcceptedOperation;
use App\Communication\Support\InboxMembership;
use App\Communication\Support\MessageBody;
use App\Communication\Support\MessageEnvelope;
use App\Desks\Models\DeskRecord;
use App\Numbers\Models\GlobalGroup;
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
        $first = new InboxMembership($this->author, new AssignmentReference(TestIds::of(1), $this->holder()));
        $second = new InboxMembership(
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

    private function ask(): Message
    {
        $receipt = CommandReceipt::take(
            ReceiptCaller::withoutSession(ActorContext::forAgent(TestIds::of(7))),
            (string) str()->ulid(),
            new stdClass(),
            ReceiptRetention::standard(),
        );
        $envelope = MessageEnvelope::ask(
            DeskRecord::openSourceDesk((string) str()->ulid(), 'From'),
            DeskRecord::openSourceDesk((string) str()->ulid(), 'To'),
            $this->author,
            MessageBody::from('Can you look?'),
        );

        return Message::record($envelope, new AcceptedOperation($receipt->id));
    }

    private function holder(): AssigneeIdentity
    {
        return AssigneeIdentity::ofActorIdentity($this->author);
    }
}
