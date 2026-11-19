<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Exceptions\ActorNotAllowed;
use App\Assignments\Exceptions\AssignmentConflict;
use App\Assignments\Support\AssignmentReference;
use App\Communication\Commands\ReadMessages;
use App\Communication\Commands\ReleaseMessageClaim;
use App\Communication\Enums\MessageState;
use App\Communication\Models\Message;
use Tests\Support\MessagingTestCase;

/**
 * The owner releases the exact claim an agent holds on a question it took up, so another member may take it; the
 * question still waits, a claim that changed in between is refused, and an agent may not release one.
 */
final class ReleaseMessageClaimTest extends MessagingTestCase
{
    public function test_the_owner_releases_the_exact_claim_and_the_question_still_waits(): void
    {
        $questionId = $this->takenUpByBuilder();
        $this->asOwner();

        $this->runOnBus(new ReleaseMessageClaim($questionId, $this->claimOf($questionId), 'The builder is stuck.'));

        $this->assertSame([], $this->claimsOn($questionId));
        $this->assertSame(MessageState::WaitingForAnswer, Message::query()->findOrFail($questionId)->state);
    }

    public function test_a_claim_that_changed_in_between_is_refused(): void
    {
        $questionId = $this->takenUpByBuilder();
        $claim = $this->claimOf($questionId);
        $this->asOwner();
        $this->runOnBus(new ReleaseMessageClaim($questionId, $claim, 'First release.'));

        $this->expectException(AssignmentConflict::class);

        $this->runOnBus(new ReleaseMessageClaim($questionId, $claim, 'Second release.'));
    }

    public function test_an_agent_may_not_release_a_claim(): void
    {
        $questionId = $this->takenUpByBuilder();

        $this->expectException(ActorNotAllowed::class);

        $this->runOnBus(new ReleaseMessageClaim($questionId, $this->claimOf($questionId), 'Mine to give up.'));
    }

    private function takenUpByBuilder(): string
    {
        $questionId = $this->ownerAsks($this->inboxIdOf($this->builder), 'Which port?');
        $this->asAgent($this->builder);
        $this->runOnBus(new ReadMessages($this->inboxIdOf($this->builder), [$questionId]));

        return $questionId;
    }

    private function claimOf(string $messageId): AssignmentReference
    {
        return $this->claimsOn($messageId)[$messageId]->reference;
    }
}
