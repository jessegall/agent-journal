<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Commands;

use App\Models\Messages\Message;
use Domain\Chat\Commands\React\ReactCommand;
use Domain\Chat\Exceptions\ReactionRefused;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;

/**
 * A member reacts to a message with one emoji, sent as a reply to it in its inbox; anything but one emoji is refused
 * and sends nothing.
 */
#[TestsCommand(ReactCommand::class)]
final class ReactTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['messages'];

    private Message $message;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner()->agent('Planner');
        $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Planner');
        $this->message = $this->journal->post(
            'Planner',
            $this->journal->fixtures(ChatFixtures::class)->pairChatOf('Owner', 'Planner'),
            'The build is green.',
        );
    }

    public function test_a_reaction_is_one_emoji_sent_as_a_reply_to_the_message(): void
    {
        $replyId = $this->journal->run(new ReactCommand($this->message->id, '👍'));

        $reply = Message::query()->findOrFail($replyId);
        $this->assertSame([
            '👍',
            $this->message->id,
        ], [
            $reply->body,
            $reply->target_message_id,
        ]);
    }

    public function test_anything_but_one_emoji_is_refused_and_sends_nothing(): void
    {
        foreach ([
            'ok',
            '👍👍',
            '',
        ] as $emoji) {
            $this->assertThrows(
                fn () => $this->journal->run(new ReactCommand($this->message->id, $emoji)),
                ReactionRefused::class,
            );
        }

        $this->assertSame(1, Message::query()->withoutGlobalScopes()->count());
    }
}
