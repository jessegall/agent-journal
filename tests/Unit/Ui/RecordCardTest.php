<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Enums\Icon;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\RecordCard;
use Tests\TestCase;

/**
 * The shared card recipe: an icon, title and badge on one line, the moment, and only the actions that are given.
 */
final class RecordCardTest extends TestCase
{
    public function test_a_card_holds_its_head_its_moment_and_only_the_actions_it_is_given(): void
    {
        $card = RecordCard::make('question-4', Icon::Speech, 'Which branch?')
            ->withBadge('Waiting', 'warn')
            ->happened('Asked', '2026-11-22T10:00:00Z')
            ->withActions(LayoutPartData::action('answer', 'Answer', LayoutActionData::to('/chat/4')))
            ->part();

        $this->assertSame('card', $card->style);
        $this->assertSame(['head', 'time', 'actions'], $this->keysOf($card->children));
        $this->assertSame(['icon', 'title', 'badge'], $this->keysOf($card->children[0]->children));
        $this->assertSame('chat', $card->children[0]->children[0]->text);
        $this->assertSame(['answer'], $this->keysOf($card->children[2]->children));
    }

    public function test_a_card_with_no_permitted_action_or_badge_draws_neither(): void
    {
        $card = RecordCard::make('merge-2', Icon::Plan, 'Merge request')->part();

        $this->assertSame(['head'], $this->keysOf($card->children));
        $this->assertSame(['icon', 'title'], $this->keysOf($card->children[0]->children));
    }

    /**
     * @param  list<LayoutPartData>  $parts
     * @return list<string>
     */
    private function keysOf(array $parts): array
    {
        return array_map(fn (LayoutPartData $part) => $part->key, $parts);
    }
}
