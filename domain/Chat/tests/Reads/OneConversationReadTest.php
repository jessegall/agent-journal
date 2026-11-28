<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Reads;

use App\Bus\Contracts\RequestKey;
use App\Models\Inboxes\Inbox;
use Domain\Chat\Data\ChatData;
use Domain\Chat\Http\Pages\ChatPageBuilder;
use Domain\Chat\Support\PairChats;
use Domain\Chat\Tests\TestCase;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Tests\Support\RefreshHookDatabase;

/**
 * The chat window reads one conversation per request: the chosen agent's, or the one a column's own reload names,
 * never every chat open beside it.
 */
final class OneConversationReadTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_visit_with_three_chats_beside_reads_the_chosen_conversation_alone(): void
    {
        $this->journal->owner()
            ->idleAgent('Agent 2', 'main-agent')
            ->idleAgent('Agent 3', 'main-agent')
            ->idleAgent('Agent 4', 'main-agent')
            ->idleAgent('Agent 5', 'main-agent');
        $chosen = $this->journal->agentCalled('Agent 2')->id;

        $window = $this->windowFor([
            'agent' => $chosen,
            'beside' => array_map(
                fn (string $name) => $this->journal->agentCalled($name)->id,
                ['Agent 3', 'Agent 4', 'Agent 5'],
            ),
        ]);

        $this->assertSame(
            [$chosen, $chosen, 1],
            [
                $window->selectedAgentId,
                $window->conversation->agentId,
                Inbox::query()->withProviderKey(PairChats::PAIR_PROVIDER)->count(),
            ],
        );
    }

    public function test_a_columns_reload_reads_its_own_conversation_and_keeps_the_chosen_agent(): void
    {
        $this->journal->owner()->idleAgent('Agent 2', 'main-agent')->idleAgent('Agent 3', 'main-agent');
        $chosen = $this->journal->agentCalled('Agent 2')->id;
        $column = $this->journal->agentCalled('Agent 3')->id;

        $window = $this->windowFor(['agent' => $chosen, 'read' => $column]);

        $this->assertSame(
            [$chosen, $column, 1],
            [
                $window->selectedAgentId,
                $window->conversation->agentId,
                Inbox::query()->withProviderKey(PairChats::PAIR_PROVIDER)->count(),
            ],
        );
    }

    /**
     * @param  array<string, mixed>  $query
     */
    private function windowFor(array $query): ChatData
    {
        $visit = Request::create('/', 'GET', $query);

        return $this->app->make(RequestKey::class)->independently(
            (string) Str::ulid(),
            fn () => $this->app->make(ChatPageBuilder::class)->build($visit),
        );
    }
}
