<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\ReadMessages\ReadMessagesCommand;
use App\Contracts\Chat\ConversationResolver;
use App\Data\Messages\MessageClaimHolder;
use App\Data\Messages\MessageReader;
use Spatie\LaravelData\Optional;
use Tests\Support\MessagingTestCase;

/**
 * A message as Core projects it: its inboxes and author by name, no first reader and no claim holder until someone
 * reads it and takes it up, and then exactly who did.
 */
final class ConversationProjectionTest extends MessagingTestCase
{
    public function test_a_question_shows_its_inboxes_and_author_and_who_took_it_up_once_someone_did(): void
    {
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Which port?');

        $unread = $this->resolver()->detail($questionId);

        $this->assertSame($this->ownerInboxId(), $unread->sourceInboxId);
        $this->assertSame('Own', $unread->destinationInboxLabel);
        $this->assertNotNull($unread->authorLabel);
        $this->assertInstanceOf(Optional::class, $unread->firstReader);
        $this->assertInstanceOf(Optional::class, $unread->claimHolder);
        $this->assertArrayNotHasKey('firstReader', $unread->toArray());

        $this->asAgent($this->builder);
        $this->runOnBus(new ReadMessagesCommand($this->inboxIdOf($this->builder), [$questionId]));
        $taken = $this->resolver()->detail($questionId);

        $this->assertInstanceOf(MessageReader::class, $taken->firstReader);
        $this->assertSame($this->builder->agent_id, $taken->firstReader->actorId);
        $this->assertInstanceOf(MessageClaimHolder::class, $taken->claimHolder);
        $this->assertSame($this->builder->agent_id, $taken->claimHolder->holderId);
    }

    private function resolver(): ConversationResolver
    {
        return $this->app->make(ConversationResolver::class);
    }
}
