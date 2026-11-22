<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Actors\Enums\ChatPermission;
use App\Actors\Support\ActorIdentity;
use App\Communication\Commands\AskChatQuestion;
use App\Communication\Commands\PostChatMessage;
use App\Communication\Commands\ReplyInChat;
use App\Communication\Exceptions\RespondentRequired;
use App\Communication\Exceptions\StaleAddressee;
use App\Communication\Models\Message;
use Carbon\CarbonImmutable;
use Domain\Access\Models\EnvironmentUserGrant;
use Domain\Access\Models\User;
use Domain\Chat\Commands\AddChatParticipant;
use Domain\Chat\Commands\CreateGroupChat;
use Domain\Chat\Commands\RemoveChatParticipant;
use Domain\Chat\Data\ChatMessageData;
use Domain\Chat\Resolvers\Support\ChatConversations;
use Tests\Support\MessagingTestCase;

/**
 * Addressing in a group: a post to someone who left is refused, a question names who settles it, only that member is
 * offered to answer or decline, and a reply to a message from before a member joined shows its original as unavailable.
 */
final class ChatAddressingTest extends MessagingTestCase
{
    private User $bea;

    private User $cy;

    private User $dee;

    private string $inboxId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->bea = $this->grantedUser('Bea');
        $this->cy = $this->grantedUser('Cy');
        $this->dee = $this->grantedUser('Dee');
        $this->asOwner();
        $this->inboxId = $this->runOnBus(new CreateGroupChat('Design', [$this->bea->id, $this->cy->id]));
    }

    public function test_addressing_someone_who_left_and_a_question_without_respondent_are_refused(): void
    {
        $this->runOnBus(new AddChatParticipant($this->inboxId, $this->keyOf($this->dee)));
        $this->runOnBus(new RemoveChatParticipant($this->inboxId, $this->keyOf($this->dee)));

        $this->assertThrows(
            fn () => $this->runOnBus(
                new PostChatMessage($this->inboxId, 'Hi', 'to-dee', null, $this->keyOf($this->dee)),
            ),
            StaleAddressee::class,
        );
        $this->assertThrows(
            fn () => $this->runOnBus(new AskChatQuestion($this->inboxId, 'Ready?', 'nobody')),
            RespondentRequired::class,
        );
        $this->assertSame(0, Message::query()->acrossInboxes()->where('body', 'Hi')->count());
    }

    public function test_only_the_named_respondent_is_offered_to_settle_the_question(): void
    {
        $questionId = $this->runOnBus(
            new AskChatQuestion($this->inboxId, 'Ready?', 'to-bea', $this->keyOf($this->bea)),
        );

        $this->startUserRequestAs($this->bea->id);
        $this->assertTrue($this->rowAs($questionId)->actions->answer);

        $this->startUserRequestAs($this->cy->id);
        $this->assertFalse($this->rowAs($questionId)->actions->answer);
    }

    public function test_a_reply_shows_an_original_from_before_a_member_joined_as_unavailable(): void
    {
        $originalId = $this->runOnBus(new PostChatMessage($this->inboxId, 'Before Dee.', 'before'));
        $this->runOnBus(new AddChatParticipant($this->inboxId, $this->keyOf($this->dee)));
        $replyId = $this->runOnBus(new ReplyInChat($originalId, 'Following up.', 'after'));

        $this->startUserRequestAs($this->dee->id);
        $reply = $this->rowAs($replyId);

        $this->assertNotNull($reply->replyTo);
        $this->assertFalse($reply->replyTo->visible);
        $this->assertNull($reply->replyTo->id);
    }

    private function rowAs(string $messageId): ChatMessageData
    {
        $page = $this->app->make(ChatConversations::class)->pageFor(null, $this->inboxId, null);

        return array_values(array_filter($page->messages, fn (ChatMessageData $row) => $row->id === $messageId))[0];
    }

    private function grantedUser(string $name): User
    {
        $user = User::factory()->create(['name' => $name]);
        EnvironmentUserGrant::create(
            $user,
            null,
            [ChatPermission::ReceiveInvitations],
            ActorIdentity::of($this->owner),
            CarbonImmutable::now(),
        );
        $this->inboxOf(ActorIdentity::of($user));

        return $user;
    }

    private function keyOf(User $user): string
    {
        return "user:{$user->id}";
    }
}
