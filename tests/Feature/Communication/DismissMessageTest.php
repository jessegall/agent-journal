<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Exceptions\ActorNotAllowed;
use App\Communication\Commands\AskMessage;
use App\Communication\Commands\DismissMessage;
use App\Communication\Commands\ReadMessages;
use App\Communication\Enums\DismissalType;
use App\Communication\Enums\MessageState;
use App\Communication\Models\Message;
use Tests\Support\MessagingTestCase;

/**
 * A message is dismissed with a reason: its author withdraws it, a member of its destination declines it, and the
 * owner may cancel any; the claim on it ends, and an agent with no part in it is refused.
 */
final class DismissMessageTest extends MessagingTestCase
{
    public function test_the_author_withdraws_and_a_member_declines(): void
    {
        $withdrawn = $this->ownerAsks($this->inboxIdOf($this->builder), 'Still needed?');
        $declined = $this->ownerAsks($this->inboxIdOf($this->builder), 'Can you?');

        $this->runOnBus(new DismissMessage($withdrawn, 'No longer needed.'));
        $this->asAgent($this->builder);
        $this->runOnBus(new ReadMessages($this->inboxIdOf($this->builder), [$declined]));
        $this->runOnBus(new DismissMessage($declined, 'Not my area.'));

        $this->assertSame(DismissalType::Withdrawn, $this->stored($withdrawn)->dismissal_type);
        $this->assertSame(DismissalType::Declined, $this->stored($declined)->dismissal_type);
        $this->assertSame(MessageState::Dismissed, $this->stored($declined)->state);
        $this->assertSame([], $this->claimsOn($declined));
    }

    public function test_the_owner_cancels_a_message_between_two_agents(): void
    {
        $this->asAgent($this->builder);
        $questionId = $this->runOnBus(new AskMessage(
            $this->inboxIdOf($this->builder),
            $this->inboxIdOf($this->reviewer),
            'Review?',
        ));
        $this->asOwner();

        $this->runOnBus(new DismissMessage($questionId, 'Cancelled by the owner.'));

        $this->assertSame(DismissalType::Cancelled, $this->stored($questionId)->dismissal_type);
    }

    public function test_an_agent_with_no_part_in_the_message_is_refused(): void
    {
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Can you?');
        $this->asAgent($this->reviewer);

        $this->expectException(ActorNotAllowed::class);

        $this->runOnBus(new DismissMessage($questionId, 'Not mine.'));
    }

    private function stored(string $messageId): Message
    {
        return Message::query()->withoutGlobalScopes()->findOrFail($messageId);
    }
}
