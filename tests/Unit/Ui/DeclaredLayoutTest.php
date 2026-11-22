<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Section;
use App\Ui\Enums\ActionMethod;
use App\Ui\Enums\Icon;
use App\Ui\Enums\LayoutTag;
use App\Ui\Enums\SlotContextType;
use App\Ui\Exceptions\InvalidPageDeclaration;
use App\Ui\Exceptions\InvalidSectionDeclaration;
use App\Ui\Exceptions\LayoutRefused;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutActionData;
use App\Ui\Layout\LayoutFactValueData;
use App\Ui\Layout\LayoutFieldData;
use App\Ui\Layout\LayoutFormData;
use App\Ui\Layout\LayoutLimits;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRowData;
use PHPUnit\Framework\TestCase;
use Spatie\LaravelData\Optional;
use Tests\Fixtures\UiDeclarations\Desk\NotesResolver;
use Tests\Fixtures\UiDeclarations\RecentNotesResolver;
use Tests\Fixtures\UiDeclarations\ShelfLayoutResolver;
use Tests\Fixtures\UiDeclarations\ShelfSectionLayoutResolver;

/**
 * A page a domain declares as a layout: its reader must return a layout, and a layout that breaks the catalogue of
 * box, text, collection and notice is refused whole, naming the part.
 */
final class DeclaredLayoutTest extends TestCase
{
    private const string OWNER_ONLY_REASON = 'Only the owner approves';

    private const array BADGE_TONES = ['quiet', 'good', 'warn', 'danger', 'busy'];

    public function test_a_layout_page_is_drawn_by_the_shared_renderer_from_its_readers_layout(): void
    {
        $page = Page::layout('shelf', 'Shelf', Icon::Docs, ShelfLayoutResolver::class)->at('shelf');

        $this->assertTrue($page->isDeclared);
        $this->assertSame(DeclaredLayoutData::class, $page->dataClass);
        $this->assertSame(DomainUi::DECLARED_LAYOUT, $page->component);
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
        $this->assertSame(DomainUi::DECLARED_LAYOUT, $section->component);

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

    public function test_a_variant_outside_the_catalogue_is_refused(): void
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
            leading: [LayoutPartData::text('driver', 'Claude', 'badge')],
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
}
