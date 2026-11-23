<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Contracts\Chat\ChatLines;
use App\Events\StartAccepted;
use App\Listeners\ShowHelperStartInChat;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use App\Values\ChatLine;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

/**
 * A helper's start shows as a line naming the helper in its parent's chat, and a start of its own shows nothing.
 */
final class HelperStartChatLineTest extends MessagingTestCase
{
    use OpensPairChats;

    public function test_a_helper_start_shows_in_the_chat_of_the_agent_that_started_it(): void
    {
        $inboxId = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder))->inbox_id;
        $listener = $this->app->make(ShowHelperStartInChat::class);

        $listener->handle(new StartAccepted('request-1', $this->reviewer->agent_id, $this->reviewer->id));
        $this->assertSame([], $this->subjectsIn($inboxId));

        $listener->handle(new StartAccepted(
            'request-2',
            $this->reviewer->agent_id,
            $this->reviewer->id,
            parentAgentId: $this->builder->agent_id,
        ));

        $this->assertSame([Agent::query()->findOrFail($this->reviewer->agent_id)->name], $this->subjectsIn($inboxId));
    }

    /**
     * @return list<string>
     */
    private function subjectsIn(string $inboxId): array
    {
        return array_map(
            fn (ChatLine $line) => $line->subject,
            $this->app->make(ChatLines::class)->linesFrom($inboxId, 0),
        );
    }
}
