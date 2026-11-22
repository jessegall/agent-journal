<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\ReadMessages\ReadMessagesCommand;
use App\Data\MessageReadBatch;
use App\Exceptions\InboxUnavailable;
use App\Exceptions\MessageMissing;
use App\Models\Message;
use App\Support\ProvedClaims;
use Tests\Support\MessagingTestCase;

/**
 * A member reads messages in its inbox: the first read marks it read, and a question it reads is taken up by it, so
 * its claim stands; reading again changes nothing, and an inbox it is not seated at refuses.
 */
final class ReadMessagesTest extends MessagingTestCase
{
    public function test_the_first_reader_takes_up_a_question_and_a_second_read_changes_nothing(): void
    {
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Which port?');
        $noteId = $this->ownerSends($this->inboxIdOf($this->builder), 'FYI.');
        $this->asAgent($this->builder);

        $first = $this->read([$questionId, $noteId]);
        $again = $this->read([$questionId]);

        $this->assertSame([[$questionId, true, true], [$noteId, true, false]], $this->rows($first));
        $this->assertSame([[$questionId, false, false]], $this->rows($again));
        $this->assertNotNull(Message::query()->findOrFail($noteId)->read_at);
        $claims = $this->app->make(ProvedClaims::class)->validClaimsOn(Message::LINK_TYPE, [$questionId]);
        $this->assertTrue($claims[$questionId]->holder()->isSameAs($this->assigneeOf($this->builder)));
    }

    public function test_a_message_outside_the_inbox_is_missing(): void
    {
        $toReviewer = $this->ownerSends($this->inboxIdOf($this->reviewer), 'Not yours.');
        $this->asAgent($this->builder);

        $this->expectException(MessageMissing::class);

        $this->read([$toReviewer]);
    }

    public function test_an_inbox_the_reader_is_not_seated_at_refuses(): void
    {
        $toReviewer = $this->ownerSends($this->inboxIdOf($this->reviewer), 'Not yours.');
        $this->asAgent($this->builder);

        $this->expectException(InboxUnavailable::class);

        $this->runOnBus(new ReadMessagesCommand($this->inboxIdOf($this->reviewer), [$toReviewer]));
    }

    /**
     * @param  list<string>  $messageIds
     */
    private function read(array $messageIds): MessageReadBatch
    {
        return $this->runOnBus(new ReadMessagesCommand($this->inboxIdOf($this->builder), $messageIds));
    }

    /**
     * @return list<array{string, bool, bool}>
     */
    private function rows(MessageReadBatch $batch): array
    {
        return array_map(
            fn ($read) => [$read->messageId, $read->firstRead, $read->takenUp],
            $batch->messageReads,
        );
    }
}
