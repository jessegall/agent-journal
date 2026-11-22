<?php

declare(strict_types=1);

namespace Domain\Chat\Tests\Feature;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Docking\Cards\DockIdentity;
use App\Docking\Sources\Contracts\DockRegistration;
use App\Docking\Wire\EncodedCard;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Chat\Data\DockPageData;
use Domain\Chat\Models\DockPlacement;
use Domain\Chat\Support\AuthorizedConversations;
use Domain\Chat\Support\ConversationPeers;
use Domain\Chat\Support\DockProjection;
use Domain\Chat\Tests\TestCase;
use Tests\Fixtures\Docking\ProjectionDockable;
use Tests\Support\OpensPairChats;
use Tests\Fixtures\Docking\ProjectionDockableProvider;
use Tests\Support\CommitsHookRows;
use Tests\Support\StartsAgentRequests;
use Tests\Support\StartsMainAgents;
use Tests\Support\WritesInboxMessages;

/**
 * A dock page reads placements newest first in bounded batches and shows only what the viewer may read: placements it
 * may not read move the page on without a word, a page stops before the card that would pass its byte budget and the
 * next page starts at that card, and a card whose tree cannot be written shows only its summary.
 */
final class DockProjectionTest extends TestCase
{
    use OpensPairChats;
    use CommitsHookRows;
    use StartsAgentRequests;
    use StartsMainAgents;
    use WritesInboxMessages;

    private const array TABLES = [
        'users',
        'agents',
        'agent_sessions',
        'start_tokens',
        'agent_stacks',
        'hook_calls',
        'inboxes',
        'desks',
        'desk_seats',
        'desk_preferences',
        'assignments',
        'command_receipts',
        'links',
        'conversations',
        'dock_placements',
    ];

    private const string TYPE = 'fixtures.projection';

    private User $owner;

    private ConversationPeers $peers;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $agentId = $this->startedMainAgentSession()->agent_id;
        $this->pairChat(ActorIdentity::of($this->owner), new ActorIdentity(ActorType::Agent, $agentId));

        $this->app->make(DockRegistration::class)->register(
            self::TYPE,
            ProjectionDockable::class,
            ProjectionDockableProvider::class,
        );

        $this->startUserRequestAs($this->owner->id);
        $this->peers = $this->app->make(AuthorizedConversations::class)->withAgent($agentId);
    }

    public function test_three_unreadable_batches_give_an_empty_page_and_the_readable_card_comes_next(): void
    {
        $this->dock(['shown-1', ...array_map(fn (int $number) => "hidden-{$number}", range(1, 150))]);

        $first = $this->page(null);
        $second = $this->page($first->more);

        $this->assertSame([], $first->cards);
        $this->assertSame(['shown-1'], $this->names($second));
    }

    public function test_a_page_of_large_cards_stays_in_its_budget_and_the_next_starts_at_the_card_it_left(): void
    {
        $this->dock(array_map(fn (int $number) => sprintf('large-%02d', $number), range(1, 10)));

        $first = $this->page(null);
        $second = $this->page($first->more);

        $this->assertLessThan(DockProjection::BYTE_LIMIT, strlen((string) json_encode($first)));
        $this->assertNotEmpty($first->cards);

        $this->assertSame(
            array_map(fn (int $number) => sprintf('large-%02d', $number), range(10, 1)),
            [...$this->names($first), ...$this->names($second)],
        );
    }

    public function test_a_card_whose_tree_cannot_be_written_shows_only_its_summary(): void
    {
        $this->dock(['broken-1']);

        $card = $this->page(null)->cards[0];

        $this->assertSame('broken-1', $card->safeSummary);
        $this->assertNull($card->root);
        $this->assertNull($card->open);
    }

    /**
     * Docks the sources one second apart, the first oldest.
     *
     * @param  list<string>  $ids
     */
    private function dock(array $ids): void
    {
        $conversation = $this->peers->conversation();
        $at = CarbonImmutable::now()->subDay();

        foreach ($ids as $id) {
            $at = $at->addSecond();
            CarbonImmutable::setTestNow($at);
            $source = new DockIdentity(self::TYPE, $id);
            DockPlacement::create($conversation, $source, 'default', ActorIdentity::of($this->owner));
        }

        CarbonImmutable::setTestNow();
    }

    private function page(string|null $token): DockPageData
    {
        return $this->app->make(DockProjection::class)->page($this->peers->existingConversation(), $token);
    }

    /**
     * @return list<string>
     */
    private function names(DockPageData $page): array
    {
        return array_map(fn (EncodedCard $card) => $card->accessibleName, $page->cards);
    }
}
