<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use Domain\Chat\Data\ConversationData;
use Domain\Chat\Http\Pages\Resolvers\ChatWindowResolver;
use Domain\Chat\Http\Requests\ConversationRequest;
use Domain\Chat\Tests\TestCase;

/**
 * Side by side, the chat window reads the chats the query names beside the chosen one, each with its own agent; the
 * chosen agent is not read twice.
 */
final class BesideChatsTest extends TestCase
{
    public function test_two_main_agents_show_side_by_side_each_in_its_own_chat(): void
    {
        $this->journal->owner()->idleAgent('Agent 2', 'main-agent')->idleAgent('Agent 3', 'main-agent');
        $second = $this->journal->agentCalled('Agent 2')->id;
        $third = $this->journal->agentCalled('Agent 3')->id;

        $this->app->instance(ConversationRequest::class, ConversationRequest::create('/', 'GET', [
            'agent' => $second,
            'beside' => [$third, $second],
        ]));

        $window = $this->app->make(ChatWindowResolver::class)->read();

        $this->assertSame($second, $window->selectedAgentId);
        $this->assertSame(
            [$third],
            array_map(fn (ConversationData $conversation) => $conversation->agentId, $window->beside),
        );
    }
}
