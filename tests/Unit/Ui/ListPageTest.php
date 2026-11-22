<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Ui\Enums\LayoutTag;
use App\Ui\Enums\NarrowView;
use App\Ui\Enums\ReaderWidth;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutBackData;
use App\Ui\Layout\LayoutFieldData;
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

        $this->assertSame(['title'], $this->keysOf($without->children[0]->children));
        $this->assertSame(['title', 'count'], $this->keysOf($with->children[0]->children));
        $this->assertSame('9', $with->children[0]->children[1]->text);
    }

    public function test_the_header_ends_with_the_creation_and_the_tabs_hold_the_rows(): void
    {
        $root = ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))
            ->creating('Create', LayoutActionData::to('/tasks/new'))
            ->withTabs(new LayoutTabData('open', 'Open', true), new LayoutTabData('all', 'All', false))
            ->layout()->root;

        $this->assertSame('creation', $root->children[0]->children[1]->key);
        $this->assertSame(LayoutTag::Tabs, $root->children[1]->tag);
        $this->assertSame('rows', $root->children[1]->children[0]->children[0]->key);
    }

    public function test_a_numbered_list_disables_the_end_controls(): void
    {
        $first = $this->pagingOf(ListPaging::numbered(1, 3));
        $last = $this->pagingOf(ListPaging::numbered(3, 3));

        $this->assertSame(['first', 'previous', 'position', 'next', 'last'], $this->keysOf($first->children));
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

        $this->assertSame(['rows'], $this->keysOf($content->children));
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

        $this->assertSame(['empty', 'empty-actions'], $this->keysOf($offered->children));
        $this->assertSame('clear', $offered->children[1]->children[0]->key);
        $this->assertSame(['empty'], $this->keysOf($informed->children));
        $this->assertSame('empty', $informed->children[0]->style);
    }

    public function test_the_header_puts_the_views_beside_the_title_and_the_search_and_creation_apart(): void
    {
        $header = ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))
            ->counting(4)
            ->withViews(new LayoutRowData('list', 'List', query: ['view' => ''], isCurrent: true))
            ->searching('Search tasks', new LayoutFieldData('q', '', ['page']))
            ->creating('Create task', LayoutActionData::to('/tasks/new'))
            ->layout()->root->children[0];

        $this->assertSame('bar', $header->style);
        $this->assertSame(
            ['title', 'count', 'views', 'search', 'creation'],
            $this->keysOf($header->children),
        );
        $this->assertSame('choices', $header->children[2]->style);
    }

    public function test_a_populated_index_without_a_selection_shows_nothing_selected_in_the_reader(): void
    {
        $back = new LayoutBackData('/tasks?state=open&page=2', 'Tasks');

        $split = ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))
            ->withReader($back)
            ->layout()->root->children[1];
        $empty = ListPage::make('Tasks', [], ListEmpty::informing('Empty'))
            ->withReader($back)
            ->layout()->root->children[1];

        $this->assertSame('split', $split->style);
        $this->assertSame(['list', 'nothing-selected'], $this->keysOf($split->children));
        $this->assertSame(['list'], $this->keysOf($empty->children));
    }

    public function test_an_index_address_shows_the_list_and_a_record_address_the_reader_with_back_to_its_list(): void
    {
        $back = new LayoutBackData('/tasks?state=open&page=2', 'Tasks');

        $index = ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))
            ->withReader($back)
            ->layout()->root->children[1];
        $record = ListPage::make('Tasks', $this->rows(1), ListEmpty::informing('Empty'))
            ->withReader($back, LayoutPartData::text('facts', 'x'))
            ->withReaderWidth(ReaderWidth::Settings)
            ->layout()->root->children[1];

        $this->assertSame(430, $index->split->listWidth);
        $this->assertSame(NarrowView::List, $index->split->narrowShows);
        $this->assertInstanceOf(Optional::class, $index->split->back);
        $this->assertSame(NarrowView::Reader, $record->split->narrowShows);
        $this->assertSame(ReaderWidth::Settings, $record->split->readerWidth);
        $this->assertSame($back->href, $record->split->back->href);
        $this->assertSame(['list', 'facts'], $this->keysOf($record->children));
    }

    /**
     * @param  list<LayoutPartData>  $parts
     * @return list<string>
     */
    private function keysOf(array $parts): array
    {
        return array_map(fn (LayoutPartData $part) => $part->key, $parts);
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
