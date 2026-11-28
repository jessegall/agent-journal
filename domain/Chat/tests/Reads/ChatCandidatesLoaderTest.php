<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use Domain\Chat\Data\ChatCandidatesData;
use Domain\Chat\Data\ChatInput;
use Domain\Chat\Exceptions\ChatUnavailable;
use Domain\Chat\Http\Loaders\ChatCandidatesLoader;
use Domain\Chat\Support\ChatDirectory;
use Domain\Chat\Tests\Fixtures\ChatFixtures;
use Domain\Chat\Tests\TestCase;
use Tests\Support\Entries\Attributes\TestsRead;
use Tests\Support\RefreshHookDatabase;

/**
 * The users the manager of a group chat may add: never one already in it and at most the limit; a pair chat, or a
 * viewer who does not manage the chat, is refused.
 */
#[TestsRead(ChatCandidatesLoader::class)]
final class ChatCandidatesLoaderTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_the_manager_of_a_group_chat_reads_who_may_join_it(): void
    {
        $this->journal->owner()->user('Sam')->admitInboxMember('Sam')->actAs('Owner');
        $group = $this->app->make(ChatDirectory::class)->openGroup('Team', [$this->journal->actorCalled('Sam')]);

        $candidates = $this->read($group)->toArray()['candidates'];

        $this->assertLessThanOrEqual(ChatCandidatesLoader::CANDIDATE_LIMIT, count($candidates));
        $this->assertNotContains($this->journal->actorCalled('Sam')->text(), array_column($candidates, 'actor'));
    }

    public function test_a_pair_chat_has_no_candidates_to_read(): void
    {
        $this->journal->owner()->agent('Planner');

        $chat = $this->journal->fixtures(ChatFixtures::class)->pairChatBetween('Owner', 'Planner')
            ->pairChatOf('Owner', 'Planner');

        $this->journal->actAs('Owner');

        $this->expectException(ChatUnavailable::class);

        $this->read($chat->id);
    }

    public function test_an_inbox_member_who_does_not_manage_the_group_is_refused(): void
    {
        $this->journal->owner()->user('Sam')->admitInboxMember('Sam')->actAs('Owner');
        $group = $this->app->make(ChatDirectory::class)->openGroup('Team', [$this->journal->actorCalled('Sam')]);
        $this->journal->actAsInboxMember('Sam');

        $this->expectException(ChatUnavailable::class);

        $this->read($group);
    }

    private function read(string $inboxId): ChatCandidatesData
    {
        return $this->app->make(ChatCandidatesLoader::class)(ChatInput::validateAndCreate(['inboxId' => $inboxId]));
    }
}
