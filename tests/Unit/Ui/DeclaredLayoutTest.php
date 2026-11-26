<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Declarations\Page;
use App\Exceptions\LayoutRefused;
use App\Navigation\Declarations\DomainClient;
use App\Navigation\Enums\Icon;
use App\Profiles\Enums\SlotContextType;
use App\Settings\Enums\ActionMethod;
use App\Support\Layout\DeclaredLayoutData;
use App\Support\Layout\LayoutActionData;
use App\Support\Layout\LayoutDialogData;
use App\Support\Layout\LayoutFactValueData;
use App\Support\Layout\LayoutFieldData;
use App\Support\Layout\LayoutFormData;
use App\Support\Layout\LayoutLimits;
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Terminals\Enums\LayoutTag;
use App\Text\Declarations\Section;
use App\Text\Exceptions\InvalidSectionDeclaration;
use App\Web\Exceptions\InvalidPageDeclaration;
use PHPUnit\Framework\TestCase;
use Spatie\LaravelData\Optional;
use Tests\Fixtures\ClientDeclarations\Desk\NotesResolver;
use Tests\Fixtures\ClientDeclarations\RecentNotesResolver;
use Tests\Fixtures\ClientDeclarations\ShelfLayoutResolver;
use Tests\Fixtures\ClientDeclarations\ShelfSectionLayoutResolver;

/**
 * A page a domain declares as a layout: its reader must return a layout, and a layout that breaks the catalogue of
 * box, text, collection and notice is refused whole, naming the part.
 */
final class DeclaredLayoutTest extends TestCase
{
    private const string OWNER_ONLY_REASON = 'Only the owner approves';

    private const array BADGE_TONES = ['quiet', 'good', 'warn', 'danger', 'busy', 'waiting'];

    public function test_a_layout_page_is_drawn_by_the_shared_renderer_from_its_readers_layout(): void
    {
        $page = Page::layout('shelf', 'Shelf', Icon::Docs, ShelfLayoutResolver::class)->at('shelf');

        $this->assertTrue($page->isDeclared);
        $this->assertSame(DeclaredLayoutData::class, $page->dataClass);
        $this->assertSame(DomainClient::DECLARED_LAYOUT, $page->component);
        $this->assertSame('shelf', $page->path);

        $this->assertSame(
            ['title', 'books', 'none-lent'],
            array_map(fn (LayoutPartData $part) => $part->key, new ShelfLayoutResolver()->read()->root->children),
        );
    }

    public function test_a_layout_page_whose_reader_returns_other_data_is_refused(): void
    {
        $this->expectException(InvalidPageDeclaration::class);

        $this->expectExceptionMessage(
            InvalidPageDeclaration::readerReturnsNoLayout('notes', RecentNotesResolver::class)->getMessage(),
        );

        Page::layout('notes', 'Notes', Icon::Docs, RecentNotesResolver::class);
    }

    public function test_a_layout_section_is_drawn_by_the_shared_renderer_and_refuses_other_data(): void
    {
        $section = Section::layout('lent', 'Lent', 'library.inspector', SlotContextType::Nothing, ShelfSectionLayoutResolver::class);

        $this->assertTrue($section->isDeclared);
        $this->assertSame(DomainClient::DECLARED_LAYOUT, $section->component);

        $this->expectException(InvalidSectionDeclaration::class);

        Section::layout('notes', 'Notes', 'library.inspector', SlotContextType::Nothing, NotesResolver::class);
    }

    public function test_two_children_with_one_key_are_refused_by_their_path(): void
    {
        $this->expectException(LayoutRefused::class);
        $this->expectExceptionMessage(LayoutRefused::siblingKeyRepeated('root.list', 'same')->getMessage());

        DeclaredLayoutData::of(LayoutPartData::box(
            'root',
            'stack',
            LayoutPartData::box('list', 'stack', LayoutPartData::text('same', 'a'), LayoutPartData::text('same', 'b')),
        ));
    }

    public function test_a_driver_type_outside_the_catalogue_is_refused(): void
    {
        $this->expectException(LayoutRefused::class);

        $this->expectExceptionMessage(
            LayoutRefused::unknownStyle('root.title', LayoutTag::Text, 'shout')->getMessage(),
        );

        DeclaredLayoutData::of(LayoutPartData::box('root', 'stack', LayoutPartData::text('title', 'Hi', 'shout')));
    }

    public function test_actions_fields_and_badges_carry_their_own_bindings(): void
    {
        $layout = DeclaredLayoutData::of(LayoutPartData::box(
            'root',
            'stack',
            LayoutPartData::action('open', 'Open', LayoutActionData::to('/plans/1')),
            LayoutPartData::action('next', 'Next page', LayoutActionData::changing(['cursor' => 'abc'])),
            LayoutPartData::action(
                'approve',
                'Approve',
                LayoutActionData::unavailable(self::OWNER_ONLY_REASON),
                'primary',
            ),
            LayoutPartData::field('filter', 'Filter', new LayoutFieldData('q', 'oak')),
            LayoutPartData::badge('state', 'Open', 'good'),
        ));

        [$open, $next, $approve, $filter, $state] = $layout->root->children;
        $this->assertInstanceOf(LayoutActionData::class, $open->action);
        $this->assertInstanceOf(LayoutActionData::class, $next->action);
        $this->assertInstanceOf(LayoutActionData::class, $approve->action);
        $this->assertInstanceOf(LayoutFieldData::class, $filter->field);
        $this->assertSame('/plans/1', $open->action->href);
        $this->assertSame(['cursor' => 'abc'], $next->action->query);
        $this->assertSame(self::OWNER_ONLY_REASON, $approve->action->reason);
        $this->assertSame(['q', 'oak'], [$filter->field->name, $filter->field->value]);
        $this->assertSame('good', $state->tone);
    }

    public function test_a_submitting_action_outside_a_form_is_refused(): void
    {
        $this->expectException(LayoutRefused::class);
        $this->expectExceptionMessage(LayoutRefused::submitOutsideForm('root.save')->getMessage());

        DeclaredLayoutData::of(LayoutPartData::box(
            'root',
            'stack',
            LayoutPartData::action('save', 'Save', LayoutActionData::submitting()),
        ));
    }

    public function test_a_form_holds_its_fields_and_its_submitting_action(): void
    {
        $layout = DeclaredLayoutData::of(LayoutPartData::form(
            'settle',
            new LayoutFormData(ActionMethod::Post, '/documents/reports/42/settle', ['revision' => 1]),
            'inline',
            LayoutPartData::field('reason', 'Reason', new LayoutFieldData('reason', ''), 'text'),
            LayoutPartData::action('save', 'Settle', LayoutActionData::submitting(), 'primary'),
        ));

        $this->assertInstanceOf(LayoutFormData::class, $layout->root->form);
        $this->assertSame(['revision' => 1], $layout->root->form->fixed);
        $this->assertSame(['reason', 'save'], array_map(fn (LayoutPartData $part) => $part->key, $layout->root->children));
    }

    public function test_a_tone_outside_the_badges_tones_is_refused(): void
    {
        $this->expectException(LayoutRefused::class);
        $this->expectExceptionMessage(LayoutRefused::toneNotAllowed('root', 'loud', self::BADGE_TONES)->getMessage());

        DeclaredLayoutData::of(LayoutPartData::badge('state', 'Open', 'loud'));
    }

    public function test_a_divider_holding_children_is_refused(): void
    {
        $this->expectException(LayoutRefused::class);
        $this->expectExceptionMessage(LayoutRefused::childrenNotAllowed('root', LayoutTag::Box)->getMessage());

        DeclaredLayoutData::of(LayoutPartData::box('root', 'divider', LayoutPartData::text('title', 'Hi')));
    }

    public function test_a_layout_deeper_than_the_limit_is_refused(): void
    {
        $part = LayoutPartData::text('leaf', 'deep');

        foreach (range(0, LayoutLimits::DEPTH_LIMIT) as $level) {
            $part = LayoutPartData::box("level-{$level}", 'stack', $part);
        }

        $levels = array_map(fn (int $level) => "level-{$level}", range(LayoutLimits::DEPTH_LIMIT - 1, 0));

        $this->expectException(LayoutRefused::class);

        $this->expectExceptionMessage(
            LayoutRefused::tooDeep('root.'.implode('.', $levels).'.leaf', LayoutLimits::DEPTH_LIMIT)->getMessage(),
        );

        DeclaredLayoutData::of($part);
    }

    public function test_a_collection_past_its_row_limit_is_refused(): void
    {
        $rows = array_map(
            fn (int $row) => new LayoutRowData("row-{$row}", "Row {$row}", ''),
            range(0, LayoutLimits::ROW_LIMIT),
        );

        $this->expectException(LayoutRefused::class);

        $this->expectExceptionMessage(
            LayoutRefused::tooManyRows('root', count($rows), LayoutLimits::ROW_LIMIT)->getMessage(),
        );

        DeclaredLayoutData::of(LayoutPartData::collection('rows', 'list', $rows));
    }

    public function test_a_skeleton_carries_its_placeholder_rows_and_a_plain_notice_may_not_claim_that_style(): void
    {
        $skeleton = LayoutPartData::skeleton('loading', 3, 'Loading tasks');

        $this->assertSame(1, $skeleton->assertWithinCatalogue());
        $this->assertSame(3, $skeleton->placeholders);
        $this->assertSame('skeleton', $skeleton->style);

        $this->expectException(LayoutRefused::class);

        DeclaredLayoutData::of(LayoutPartData::notice('loading', 'skeleton', 'Loading tasks'));
    }

    public function test_a_stale_notice_holds_its_reason_in_the_notice_style_of_that_name(): void
    {
        $stale = LayoutPartData::stale('stale', 'Offline');

        $this->assertSame(1, $stale->assertWithinCatalogue());
        $this->assertSame('stale', $stale->style);
        $this->assertSame('Offline', $stale->text);
    }

    public function test_the_parts_that_lead_and_trail_a_row_count_and_are_checked_with_the_layout(): void
    {
        $row = new LayoutRowData(
            'run-1',
            'Run 1',
            leading: [LayoutPartData::text('driver', 'Claude', 'driver')],
            trailing: [LayoutPartData::badge('state', 'Running', 'busy')],
        );

        $this->assertSame(3, LayoutPartData::collection('rows', 'list', [$row])->assertWithinCatalogue());

        $this->expectException(LayoutRefused::class);

        $unknown = new LayoutRowData('run-2', 'Run 2', trailing: [LayoutPartData::text('state', 'Running', 'unheard')]);

        LayoutPartData::collection('rows', 'list', [$unknown])->assertWithinCatalogue();
    }

    public function test_a_fact_value_holds_pieces_that_link_only_when_they_have_an_address(): void
    {
        $value = LayoutFactValueData::of([['Task 3', '/tasks/3'], ['Task 4', null]]);

        $this->assertSame('/tasks/3', $value->pieces[0]->href);
        $this->assertInstanceOf(Optional::class, $value->pieces[1]->href);
    }

    public function test_a_dialog_holds_its_opener_then_its_form_with_the_footer_that_sends_it(): void
    {
        $dialog = LayoutPartData::dialog(
            'create',
            new LayoutDialogData('Create task', 'Task created'),
            LayoutPartData::action('open', 'Create task', LayoutActionData::changing([])),
            new LayoutFormData(ActionMethod::Post, '/tasks', isKeyed: true),
            [LayoutPartData::field('title', 'Title', new LayoutFieldData('title'), 'text')],
            [LayoutPartData::action('send', 'Create', LayoutActionData::submitting(), 'primary')],
        );

        $this->assertSame(['open', 'form'], array_map(fn (LayoutPartData $part) => $part->key, $dialog->children));

        $this->assertSame(['title', 'footer'], array_map(
            fn (LayoutPartData $part) => $part->key,
            $dialog->children[1]->children,
        ));

        $this->assertGreaterThan(1, $dialog->assertWithinCatalogue());
        $this->assertInstanceOf(Optional::class, $dialog->dialog->undo);
    }

    public function test_a_progress_part_carries_its_reading_and_picks_its_style_by_whether_it_counts(): void
    {
        $meter = LayoutPartData::progress('week', 72, 100, 'Weekly allowance', 'percent');
        $counted = LayoutPartData::progress('tasks', 3, 8, 'Plan 4', 'tasks', true);

        $this->assertSame(1, $meter->assertWithinCatalogue());
        $this->assertSame('meter', $meter->style);
        $this->assertSame('counted', $counted->style);
        $this->assertSame(72.0, $meter->progress->value);
        $this->assertSame(8.0, $counted->progress->max);
    }

    public function test_a_usage_part_is_a_meter_with_its_percent_and_in_a_row_carries_its_tip(): void
    {
        $reader = LayoutPartData::usage('week', 72, 'This week used');
        $row = LayoutPartData::usage('usage', 72, 'Usage', 'This week 72% used');

        $this->assertSame(1, $reader->assertWithinCatalogue());
        $this->assertSame(['usage', null], [$reader->style, $reader->detail]);
        $this->assertSame(['usage-row', 'This week 72% used'], [$row->style, $row->detail]);
        $this->assertSame(100.0, $row->progress->max);
    }

    public function test_a_share_part_is_a_short_meter_of_the_pieces_finished(): void
    {
        $share = LayoutPartData::share('progress', 3, 8, 'Plan 4', 'tasks');

        $this->assertSame(1, $share->assertWithinCatalogue());
        $this->assertSame('share', $share->style);
        $this->assertSame([3.0, 8.0], [$share->progress->value, $share->progress->max]);
    }
}
