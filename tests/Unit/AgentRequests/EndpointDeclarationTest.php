<?php

declare(strict_types=1);

namespace Tests\Unit\AgentRequests;

use App\Enums\CallEffect;
use App\Enums\ReceiptOwner;
use App\Exceptions\CallKeyInvalid;
use App\Exceptions\EndpointDeclarationInvalid;
use App\Support\CallKey;
use App\Support\EndpointDeclarations;
use Tests\Fixtures\AgentRequests\Invalid\ReadWithReceiptCall;
use Tests\Fixtures\AgentRequests\Invalid\WriteWithoutReceiptCall;
use Tests\Fixtures\AgentRequests\NoteAnswer;
use Tests\Fixtures\AgentRequests\WriteNoteCall;
use Tests\TestCase;

/**
 * A signed call declares where it goes, what it answers, what it does and who keeps a keyed write's receipt; a
 * declaration the client cannot send safely stops the boot.
 */
final class EndpointDeclarationTest extends TestCase
{
    public function test_a_keyed_write_declares_all_of_it_and_carries_its_key_as_text(): void
    {
        $endpoint = EndpointDeclarations::endpointOf(WriteNoteCall::class);
        $call = WriteNoteCall::from(['notebookId' => 'book-1', 'text' => 'Hello.', 'request_key' => 'key-1']);

        $this->assertSame(
            ['notes/{notebookId}/write', 'POST', NoteAnswer::class],
            [$endpoint->path, $endpoint->method, $endpoint->answer],
        );
        $this->assertSame([CallEffect::KeyedWrite, ReceiptOwner::CommandBus], [$endpoint->effect, $endpoint->receipt]);
        $this->assertSame('key-1', $call->requestKey->value);
        $this->assertSame('key-1', $call->toArray()['request_key']);
    }

    public function test_a_receipt_on_a_read_and_none_on_a_keyed_write_are_refused(): void
    {
        $this->assertThrows(
            fn () => EndpointDeclarations::check([ReadWithReceiptCall::class]),
            EndpointDeclarationInvalid::class,
        );
        $this->assertThrows(
            fn () => EndpointDeclarations::check([WriteWithoutReceiptCall::class]),
            EndpointDeclarationInvalid::class,
        );
    }

    public function test_a_fresh_key_is_a_ulid_and_a_malformed_one_is_refused(): void
    {
        $this->assertSame(26, strlen(CallKey::fromOption(null)->value));
        $this->assertFalse(CallEffect::SequencedWrite->isRetriedByClient());
        $this->expectException(CallKeyInvalid::class);

        CallKey::fromOption('not a key!');
    }
}
