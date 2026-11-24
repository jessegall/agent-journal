<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Contracts\Chat\Inbox;
use App\Models\Chats\InboxRecord;
use App\Models\CommandRules\CommandReceipt;
use App\Models\Messages\Message;
use App\Models\Records\GlobalGroup;
use App\Support\AcceptedOperation;
use App\Support\ActorContext;
use App\Support\DeskService;
use App\Support\MessageBody;
use App\Support\MessageEnvelope;
use App\Support\ReceiptCaller;
use App\Support\ReceiptRetention;
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
        $destination = $this->app->make(DeskService::class)->openSourceDesk((string) str()->ulid(), 'To');
        $first = $this->message($destination);
        $second = $this->message($destination);
        $third = $this->message($destination);

        DB::table('messages')->where('id', $first->id)->update(['request_key' => 'same-key']);

        $this->assertThrows(
            fn () => DB::transaction(
                fn () => DB::table('messages')->where('id', $second->id)->update(['request_key' => 'same-key']),
            ),
            QueryException::class,
        );
        $this->assertSame(
            2,
            DB::table('messages')->whereIn('id', [$second->id, $third->id])->whereNull('request_key')->count(),
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
            $this->app->make(DeskService::class)->openSourceDesk((string) str()->ulid(), 'From'),
            $destination,
            TestActors::agentIdentity(7),
            MessageBody::from('Hello.'),
        );

        return Message::create($envelope, new AcceptedOperation($receipt->id));
    }
}
