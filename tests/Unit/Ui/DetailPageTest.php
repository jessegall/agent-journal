<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Support\Layout\DetailPage;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutFactValueData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\PublicationTab;
use Tests\TestCase;

/**
 * The shared reader recipe: its head, its linked facts, its standing parts and its tabs, of which only the chosen one
 * is read, and the notice of a removed record.
 */
final class DetailPageTest extends TestCase
{
    public function test_a_reader_has_its_head_facts_standing_parts_and_the_chosen_tab_only(): void
    {
        $reads = [];

        $root = DetailPage::make('Task 7')
            ->above(LayoutPartData::action('plan', 'Plan 2', LayoutActionData::to('/plans/2')))
            ->summarising('Done when it ships')
            ->withActions(LayoutPartData::action('open', 'Open', LayoutActionData::to('/tasks/7/open')))
            ->withFacts(new LayoutRowData(
                'waits',
                'Waits for',
                fact: LayoutFactValueData::of([['Task 3', '/tasks/3'], ['Task 4', null]]),
            ))
            ->withStanding(LayoutPartData::text('note', 'Standing'))
            ->withTabs(
                PublicationTab::deferred('logs', 'Logs', function () use (&$reads): LayoutPartData {
                    $reads[] = 'logs';

                    return LayoutPartData::text('logs', 'Logs');
                }),
                PublicationTab::deferred('proofs', 'Proofs', function () use (&$reads): LayoutPartData {
                    $reads[] = 'proofs';

                    return LayoutPartData::text('proofs', 'Proofs');
                }),
            )
            ->layout('proofs')->root;

        $this->assertSame('reader', $root->style);

        $this->assertSame(
            ['title', 'metadata', 'abstract', 'actions', 'facts', 'note', 'tabs'],
            array_map(fn (LayoutPartData $part) => $part->key, $root->children),
        );

        $this->assertSame(['proofs'], $reads);
        $this->assertSame('/tasks/3', $root->children[4]->rows[0]->fact->pieces[0]->href);
    }

    public function test_a_removed_record_is_a_notice_with_back_to_its_list(): void
    {
        $root = DetailPage::removed('task', new LayoutBackData('/tasks?state=open&page=2', 'Tasks'))->root;

        $this->assertSame('removed', $root->key);
        $this->assertSame('empty', $root->children[0]->style);
        $this->assertSame('/tasks?state=open&page=2', $root->children[1]->action->href);
        $this->assertSame('Tasks', $root->children[1]->text);
    }
}
