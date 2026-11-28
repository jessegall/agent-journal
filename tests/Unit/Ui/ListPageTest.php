<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Support\Layout\EmptyListState;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutBackData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Support\Layout\LayoutTabData;
use App\Support\Layout\ListPage;
use App\Support\Layout\ListPaging;
use App\Terminals\Enums\LayoutTag;
use App\Web\Enums\NarrowView;
use App\Web\Enums\ReaderWidth;
use Spatie\LaravelData\Optional;
use Tests\TestCase;

/**
 * The shared list recipe: its header and count, tabs, rows, paging of both kinds, its empty states and the reader
 * that shows Nothing selected.
 */
final class ListPageTest extends TestCase
{
    public function test_static_lists_emit_collections_at_the_catalogue_limit_in_order(): void
    {
        foreach ([100 => [100], 101 => [100, 1], 200 => [100, 100]] as $size => $chunks) {
            $root = ListPage::build()
                ->title('Sequences')
                ->rows($this->rows($size), static fn (LayoutRowData $row): LayoutRowData => $row)
                ->empty(EmptyListState::build()->title('Empty')->finish())
                ->finish()
                ->root;
            $parts = $root->children[1]->children;

            $this->assertSame($chunks, array_map(static fn (LayoutPartData $part) => count($part->rows), $parts));
            $this->assertSame($size === 100 ? ['rows'] : ['rows', 'rows-1'], $this->keysOf($parts));
        }
    }

    public function test_an_empty_append_preserves_the_collection_address(): void
    {
        $root = ListPage::build()
            ->title('Library')
            ->rows([], static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->fillsPage(true)->finish())
            ->paged(ListPaging::build()->after(null)->isAppend(true)->finish())
            ->finish()
            ->root;
        $collection = $root->children[1]->children[0];

        $this->assertSame('rows', $collection->key);
        $this->assertSame([], $collection->rows);
    }

    public function test_a_page_fills_its_frame_and_its_list_column_stacks_without_gaps(): void
    {
        $alone = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(2), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())->finish()->root;

        $split = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(2), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())
            ->withReader(LayoutBackData::build()->href('/tasks')->label('Tasks')->finish())
            ->finish()->root;

        $this->assertSame(['page', 'page', 'page-list'], [$alone->style, $split->style, $split->children[1]->children[0]->style]);
    }

    public function test_a_page_announces_a_total_only_when_it_is_supplied(): void
    {
        $without = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(2), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())->finish()->root;
        $with = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(2), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())->counting(9)->finish()->root;

        $this->assertSame(['title'], $this->keysOf($without->children[0]->children));
        $this->assertSame(['title', 'count'], $this->keysOf($with->children[0]->children));
        $this->assertSame('9', $with->children[0]->children[1]->text);
    }

    public function test_the_header_ends_with_the_creation_and_the_tabs_hold_the_rows(): void
    {
        $root = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(1), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())
            ->creating('Create', LayoutActionData::build()->href('/tasks/new')->finish())
            ->withTabs(LayoutTabData::build()->key('open')->label('Open')->isChosen(true)->finish(), LayoutTabData::build()
                ->key('all')
                ->label('All')
                ->isChosen(false)
                ->finish())
            ->finish()->root;

        $creation = $root->children[0]->children[1];

        $this->assertSame('creation', $creation->key);
        $this->assertSame(['small', 'bordered', 'plus'], [$creation->size, $creation->style, $creation->detail]);
        $this->assertSame(LayoutTag::Tabs, $root->children[1]->tag);
        $this->assertSame('rows', $root->children[1]->children[0]->children[0]->key);
    }

    public function test_a_numbered_list_disables_the_end_controls(): void
    {
        $first = $this->pagingOf(ListPaging::build()->page(1)->lastPage(3)->finish());
        $last = $this->pagingOf(ListPaging::build()->page(3)->lastPage(3)->finish());

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
        $content = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(1), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())
            ->paged(ListPaging::build()->page(1)->lastPage(1)->finish())
            ->finish()->root->children[1];

        $this->assertSame(['rows'], $this->keysOf($content->children));
    }

    public function test_a_cursor_list_draws_one_show_more_that_appends(): void
    {
        $content = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(1), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())
            ->paged(ListPaging::build()->after('abc')->finish())
            ->finish()->root->children[1];

        $more = $content->children[1];

        $this->assertSame('more', $more->key);
        $this->assertTrue($more->action->appends);
        $this->assertSame(['after' => 'abc'], $more->action->query);

        $last = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(1), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())
            ->paged(ListPaging::build()->after(null)->finish())
            ->finish()->root->children[1];

        $this->assertCount(1, $last->children);
    }

    public function test_an_empty_list_offers_its_action_or_only_informs(): void
    {
        $clear = LayoutPartData::build()
            ->asAction()
            ->key('clear')
            ->label('Show all')
            ->action(LayoutActionData::build()->query(['state' => ''])->finish())
            ->finish();

        $offered = ListPage::build()
            ->title('Tasks')
            ->rows([], static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('None')->actions([$clear])->finish())->finish()->root->children[1];
        $informed = ListPage::build()
            ->title('Tasks')
            ->rows([], static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('None')->finish())->finish()->root->children[1];

        $this->assertSame(['empty', 'empty-actions'], $this->keysOf($offered->children));
        $this->assertSame('clear', $offered->children[1]->children[0]->key);
        $this->assertSame(['empty'], $this->keysOf($informed->children));
        $this->assertSame('empty', $informed->children[0]->style);
    }

    public function test_a_list_with_nothing_yet_fills_the_page_under_its_header_with_no_split(): void
    {
        $back = LayoutBackData::build()->href('/tasks')->label('Tasks')->finish();
        $first = LayoutPartData::build()
            ->asAction()
            ->key('first')
            ->label('New task')
            ->action(LayoutActionData::build()->href('/tasks/new')->finish())
            ->style('primary')
            ->finish();

        $root = ListPage::build()
            ->title('Tasks')
            ->rows([], static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(
                EmptyListState::build()
                    ->title('No tasks yet')
                    ->detail('What a task is.')
                    ->icon('todos')
                    ->actions([$first])
                    ->fillsPage(true)
                    ->finish(),
            )
            ->counting(0)
            ->withReader($back)
            ->finish()->root;

        $this->assertSame(['header', 'empty-page'], $this->keysOf($root->children));
        $this->assertSame('page-empty', $root->children[1]->style);
        $this->assertSame(['icon', 'empty', 'first'], $this->keysOf($root->children[1]->children));
        $this->assertSame('todos', $root->children[1]->children[0]->text);
        $this->assertSame('first', $root->children[1]->children[1]->style);
    }

    public function test_the_header_puts_the_views_beside_the_title_and_the_search_and_creation_apart(): void
    {
        $header = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(1), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())
            ->counting(4)
            ->withViews(LayoutRowData::build()
                ->key('list')
                ->label('List')
                ->query(['view' => ''])
                ->isCurrent(true)
                ->finish())
            ->searching('Search tasks', LayoutFieldData::build()
                ->name('q')
                ->value('')
                ->clears(['page'])
                ->finish())
            ->creating('Create task', LayoutActionData::build()->href('/tasks/new')->finish())
            ->finish()->root->children[0];

        $this->assertSame('page-head', $header->style);

        $this->assertSame(
            ['title', 'count', 'views', 'search', 'creation'],
            $this->keysOf($header->children),
        );

        $this->assertSame('choices', $header->children[2]->style);
    }

    public function test_a_populated_index_without_a_selection_shows_nothing_selected_in_the_reader(): void
    {
        $back = LayoutBackData::build()->href('/tasks?state=open&page=2')->label('Tasks')->finish();

        $split = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(1), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())
            ->withReader($back)
            ->finish()->root->children[1];

        $empty = ListPage::build()
            ->title('Tasks')
            ->rows([], static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())
            ->withReader($back)
            ->finish()->root->children[1];

        $this->assertSame('split', $split->style);
        $this->assertSame(['list', 'nothing-selected'], $this->keysOf($split->children));
        $this->assertSame(['list'], $this->keysOf($empty->children));
    }

    public function test_an_index_address_shows_the_list_and_a_record_address_the_reader_with_back_to_its_list(): void
    {
        $back = LayoutBackData::build()->href('/tasks?state=open&page=2')->label('Tasks')->finish();

        $index = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(1), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())
            ->withReader($back)
            ->finish()->root->children[1];

        $record = ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(1), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())
            ->withReader($back, LayoutPartData::build()->asText()->key('facts')->value('x')->finish())
            ->withReaderWidth(ReaderWidth::Settings)
            ->finish()->root->children[1];

        $this->assertSame(430, $index->split->listWidth);
        $this->assertSame(ReaderWidth::Standard, $index->split->readerWidth);
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
        return ListPage::build()
            ->title('Tasks')
            ->rows($this->rows(1), static fn (LayoutRowData $row): LayoutRowData => $row)
            ->empty(EmptyListState::build()->title('Empty')->finish())
            ->paged($paging)
            ->finish()->root->children[1]->children[1];
    }

    /**
     * @return list<LayoutRowData>
     */
    private function rows(int $count): array
    {
        return array_map(fn (int $number) => LayoutRowData::build()
            ->key("row-{$number}")
            ->label("Row {$number}")
            ->finish(), range(1, $count));
    }
}
