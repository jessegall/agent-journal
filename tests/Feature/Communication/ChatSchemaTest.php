<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Support\ActorContext;
use App\Bus\Models\CommandReceipt;
use App\Bus\Support\ReceiptCaller;
use App\Bus\Support\ReceiptRetention;
use App\Communication\Contracts\Inbox;
use App\Communication\Models\InboxRecord;
use App\Communication\Models\Message;
use App\Communication\Support\AcceptedOperation;
use App\Communication\Support\MessageBody;
use App\Communication\Support\MessageEnvelope;
use App\Desks\Support\DeskOpening;
use App\Numbers\Models\GlobalGroup;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use stdClass;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The chat schema on pgsql: a request key is used once per inbox and author, any number of rows carry none, and an
 * open chat always names its owner.
 */
final class ChatSchemaTest extends TestCase
{
    use RefreshHookDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        GlobalGroup::installJournal();
    }

    public function test_a_request_key_is_used_once_per_inbox_and_author_and_rows_without_one_are_free(): void
    {
        $destination = $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'To');
        $first = $this->message($destination);
        $second = $this->message($destination);
        $third = $this->message($destination);

        DB::table('messages')->whereKey($first->id)->update(['request_key' => 'same-key']);

        $this->assertThrows(
            fn () => DB::table('messages')->whereKey($second->id)->update(['request_key' => 'same-key']),
            QueryException::class,
        );
        $this->assertSame(
            2,
            DB::table('messages')->whereKey([$second->id, $third->id])->whereNull('request_key')->count(),
        );
    }

    public function test_an_open_chat_must_name_its_owner(): void
    {
        $inbox = InboxRecord::create('chat', (string) str()->ulid());

        $this->assertThrows(fn () => DB::table('conversations')->insert([
            'id' => (string) str()->ulid(),
            'inbox_id' => $inbox->id,
            'provider_id' => (string) str()->ulid(),
            'state' => 'open',
            'created_at' => now(),
            'updated_at' => now(),
        ]), QueryException::class);
    }

    private function message(Inbox $destination): Message
    {
        $receipt = CommandReceipt::create(
            ReceiptCaller::withoutSession(ActorContext::forAgent(TestIds::of(7))),
            (string) str()->ulid(),
            new stdClass(),
            ReceiptRetention::standard(),
        );
        $envelope = MessageEnvelope::send(
            $this->app->make(DeskOpening::class)->openSourceDesk((string) str()->ulid(), 'From'),
            $destination,
            TestActors::agentIdentity(7),
            MessageBody::from('Hello.'),
        );

        return Message::create($envelope, new AcceptedOperation($receipt->id));
    }
}
