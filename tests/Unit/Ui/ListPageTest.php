<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Ui\Enums\LayoutTag;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use App\Ui\Layout\LayoutTabData;
use App\Ui\Layout\ListEmpty;
use App\Ui\Layout\ListPage;
use App\Ui\Layout\ListPaging;
use Spatie\LaravelData\Optional;
use Tests\TestCase;

/**
 * The shared list recipe: its header and count, tabs, rows, paging of both kinds, its empty states and the reader
 * that shows Nothing selected.
 */
final class ListPageTest extends TestCase
{
    public function test_a_page_announces_a_total_only_when_it_is_supplied(): void
    {
        $without = ListPage::make('Tasks', $this->rows(2), ListEmpty::informing('Empty'))->layout()->root;
        $with = ListPage::make('Tasks', $this->rows(2), ListEmpty::informing('Empty'))->counting(9)->layout()->root;

        $this->assertSame(['title'], array_map(fn (LayoutPartData $part) => $part->key, $without->children[0]->children));
        $this->assertSame(['title', 'count'], array_map(fn (LayoutPartData $part) => $part->key, $with->children[0]->children));
        $this->assertSame('9', $with->children[0]->children[1]->text);
    }

    public function test_the_header_ends_with_the_creation_and_the_tabs_hold_the_rows(): void
    {
        $creation = LayoutPartData::action('create', 'Create', LayoutActionData::to('/tasks/new'));

        $root = ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))
            ->creating($creation)
            ->withTabs(new LayoutTabData('open', 'Open', true), new LayoutTabData('all', 'All', false))
            ->layout()->root;

        $this->assertSame('create', $root->children[0]->children[1]->key);
        $this->assertSame(LayoutTag::Tabs, $root->children[1]->tag);
        $this->assertSame('rows', $root->children[1]->children[0]->children[0]->key);
    }

    public function test_a_numbered_list_disables_the_end_controls(): void
    {
        $first = $this->pagingOf(ListPaging::numbered(1, 3));
        $last = $this->pagingOf(ListPaging::numbered(3, 3));

        $this->assertSame(['first', 'previous', 'position', 'next', 'last'], array_map(
            fn (LayoutPartData $part) => $part->key,
            $first->children,
        ));
        $this->assertInstanceOf(Optional::class, $first->children[3]->action->reason);
        $this->assertSame(['page' => '2'], $first->children[3]->action->query);
        $this->assertSame(['page' => '3'], $first->children[4]->action->query);
        $this->assertNotInstanceOf(Optional::class, $first->children[0]->action->reason);
        $this->assertNotInstanceOf(Optional::class, $first->children[1]->action->reason);
        $this->assertNotInstanceOf(Optional::class, $last->children[3]->action->reason);
        $this->assertNotInstanceOf(Optional::class, $last->children[4]->action->reason);
        $this->assertSame(['page' => '2'], $last->children[1]->action->query);
    }

    public function test_a_single_page_draws_no_paging(): void
    {
        $content = ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))
            ->paged(ListPaging::numbered(1, 1))
            ->layout()->root->children[1];

        $this->assertSame(['rows'], array_map(fn (LayoutPartData $part) => $part->key, $content->children));
    }

    public function test_a_cursor_list_draws_one_show_more_that_appends(): void
    {
        $content = ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))
            ->paged(ListPaging::cursor('abc'))
            ->layout()->root->children[1];
        $more = $content->children[1];

        $this->assertSame('more', $more->key);
        $this->assertTrue($more->action->appends);
        $this->assertSame(['after' => 'abc'], $more->action->query);

        $last = ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))
            ->paged(ListPaging::cursor(null))
            ->layout()->root->children[1];

        $this->assertCount(1, $last->children);
    }

    public function test_an_empty_list_offers_its_action_or_only_informs(): void
    {
        $clear = LayoutPartData::action('clear', 'Show all', LayoutActionData::changing(['state' => '']));

        $offered = ListPage::make('Tasks', [], ListEmpty::offering('None', $clear))->layout()->root->children[1];
        $informed = ListPage::make('Tasks', [], ListEmpty::informing('None'))->layout()->root->children[1];

        $this->assertSame(['empty', 'empty-actions'], array_map(fn (LayoutPartData $part) => $part->key, $offered->children));
        $this->assertSame('clear', $offered->children[1]->children[0]->key);
        $this->assertSame(['empty'], array_map(fn (LayoutPartData $part) => $part->key, $informed->children));
        $this->assertSame('empty', $informed->children[0]->style);
    }

    public function test_a_populated_index_without_a_selection_shows_nothing_selected_in_the_reader(): void
    {
        $split = ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))->withReader()->layout()->root;
        $chosen = ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))
            ->withReader(LayoutPartData::text('facts', 'x'))
            ->layout()->root;
        $empty = ListPage::make('Tasks', [], ListEmpty::informing('Empty'))->withReader()->layout()->root;

        $this->assertSame('split', $split->style);
        $this->assertSame(['list', 'nothing-selected'], array_map(fn (LayoutPartData $part) => $part->key, $split->children));
        $this->assertSame(['list', 'facts'], array_map(fn (LayoutPartData $part) => $part->key, $chosen->children));
        $this->assertSame(['list'], array_map(fn (LayoutPartData $part) => $part->key, $empty->children));
    }

    private function pagingOf(ListPaging $paging): LayoutPartData
    {
        return ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))
            ->paged($paging)
            ->layout()->root->children[1]->children[1];
    }

    /**
     * @return list<LayoutRowData>
     */
    private function rows(int $count): array
    {
        return array_map(fn (int $number) => new LayoutRowData("row-{$number}", "Row {$number}"), range(1, $count));
    }
}
