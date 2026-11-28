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
use App\Support\Layout\LayoutPartData;
use App\Support\Layout\LayoutRowData;
use App\Terminals\Enums\LayoutTag;
use App\Text\Declarations\Section;
use App\Text\Exceptions\InvalidSectionDeclaration;
use App\Web\Creation\Exceptions\MissingFields;
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

    public function test_a_part_requires_a_key_before_it_finishes(): void
    {
        $this->expectExceptionObject(MissingFields::forType(LayoutPartData::class, 'key'));

        LayoutPartData::build()->asText()->value('Title')->finish();
    }

    public function test_nullable_part_fields_preserve_explicit_null_and_the_variant_defaults(): void
    {
        $notice = LayoutPartData::build()->asNotice()->key('empty')->style('info')->title('Empty')->detail(null)->finish();

        $this->assertNull($notice->detail);
        $this->assertNull($notice->size);
        $this->assertInstanceOf(Optional::class, $notice->action);
    }

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

        DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asBox()
                ->key('root')
                ->style('stack')
                ->children(
                    LayoutPartData::build()
                    ->asBox()
                    ->key('list')
                    ->style('stack')
                    ->children(
                        LayoutPartData::build()->asText()->key('same')->value('a')->finish(),
                        LayoutPartData::build()->asText()->key('same')->value('b')->finish(),
                    )
                    ->finish(),
                )
                ->finish(),
            )
            ->finish();
    }

    public function test_a_driver_type_outside_the_catalogue_is_refused(): void
    {
        $this->expectException(LayoutRefused::class);

        $this->expectExceptionMessage(
            LayoutRefused::unknownStyle('root.title', LayoutTag::Text, 'shout')->getMessage(),
        );

        DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asBox()
                ->key('root')
                ->style('stack')
                ->children(
                    LayoutPartData::build()->asText()->key('title')->value('Hi')->style('shout')->finish(),
                )
                ->finish(),
            )
            ->finish();
    }

    public function test_actions_fields_and_badges_carry_their_own_bindings(): void
    {
        $layout = DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asBox()
                ->key('root')
                ->style('stack')
                ->children(
                    LayoutPartData::build()
                    ->asAction()
                    ->key('open')
                    ->label('Open')
                    ->action(LayoutActionData::build()->href('/plans/1')->finish())
                    ->finish(),
                    LayoutPartData::build()
                    ->asAction()
                    ->key('next')
                    ->label('Next page')
                    ->action(LayoutActionData::build()->query(['cursor' => 'abc'])->finish())
                    ->finish(),
                    LayoutPartData::build()
                    ->asAction()
                    ->key('approve')
                    ->label('Approve')
                    ->action(LayoutActionData::build()->reason(self::OWNER_ONLY_REASON)->finish())
                    ->style('primary')
                    ->finish(),
                    LayoutPartData::build()
                    ->asField()
                    ->key('filter')
                    ->label('Filter')
                    ->field(LayoutFieldData::build()->name('q')->value('oak')->finish())
                    ->finish(),
                    LayoutPartData::build()->asBadge()->key('state')->text('Open')->tone('good')->finish(),
                )
                ->finish(),
            )
            ->finish();

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

        DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asBox()
                ->key('root')
                ->style('stack')
                ->children(
                    LayoutPartData::build()
                    ->asAction()
                    ->key('save')
                    ->label('Save')
                    ->action(LayoutActionData::build()->submits(true)->finish())
                    ->finish(),
                )
                ->finish(),
            )
            ->finish();
    }

    public function test_a_form_holds_its_fields_and_its_submitting_action(): void
    {
        $layout = DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asForm()
                ->key('settle')
                ->form(
                    LayoutFormData::build()
                    ->method(ActionMethod::Post)
                    ->href('/documents/reports/42/settle')
                    ->fixed(['revision' => 1])
                    ->finish(),
                )
                ->style('inline')
                ->children(
                    LayoutPartData::build()
                    ->asField()
                    ->key('reason')
                    ->label('Reason')
                    ->field(LayoutFieldData::build()->name('reason')->value('')->finish())
                    ->style('text')
                    ->finish(),
                    LayoutPartData::build()
                    ->asAction()
                    ->key('save')
                    ->label('Settle')
                    ->action(LayoutActionData::build()->submits(true)->finish())
                    ->style('primary')
                    ->finish(),
                )
                ->finish(),
            )
            ->finish();

        $this->assertInstanceOf(LayoutFormData::class, $layout->root->form);
        $this->assertSame(['revision' => 1], $layout->root->form->fixed);
        $this->assertSame(['reason', 'save'], array_map(fn (LayoutPartData $part) => $part->key, $layout->root->children));
    }

    public function test_a_tone_outside_the_badges_tones_is_refused(): void
    {
        $this->expectException(LayoutRefused::class);
        $this->expectExceptionMessage(LayoutRefused::toneNotAllowed('root', 'loud', self::BADGE_TONES)->getMessage());

        DeclaredLayoutData::build()
            ->root(LayoutPartData::build()->asBadge()->key('state')->text('Open')->tone('loud')->finish())
            ->finish();
    }

    public function test_a_divider_holding_children_is_refused(): void
    {
        $this->expectException(LayoutRefused::class);
        $this->expectExceptionMessage(LayoutRefused::childrenNotAllowed('root', LayoutTag::Box)->getMessage());

        DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asBox()
                ->key('root')
                ->style('divider')
                ->children(LayoutPartData::build()->asText()->key('title')->value('Hi')->finish())
                ->finish(),
            )
            ->finish();
    }

    public function test_a_layout_deeper_than_the_limit_is_refused(): void
    {
        $part = LayoutPartData::build()->asText()->key('leaf')->value('deep')->finish();

        foreach (range(0, LayoutPartData::DEPTH_LIMIT) as $level) {
            $part = LayoutPartData::build()
                ->asBox()
                ->key("level-{$level}")
                ->style('stack')
                ->children($part)
                ->finish();
        }

        $levels = array_map(fn (int $level) => "level-{$level}", range(LayoutPartData::DEPTH_LIMIT - 1, 0));

        $this->expectException(LayoutRefused::class);

        $this->expectExceptionMessage(
            LayoutRefused::tooDeep('root.'.implode('.', $levels).'.leaf', LayoutPartData::DEPTH_LIMIT)->getMessage(),
        );

        DeclaredLayoutData::build()->root($part)->finish();
    }

    public function test_a_collection_past_its_row_limit_is_refused(): void
    {
        $rows = array_map(
            fn (int $row) => LayoutRowData::build()->key("row-{$row}")->label("Row {$row}")->value('')->finish(),
            range(0, LayoutPartData::ROW_LIMIT),
        );

        $this->expectException(LayoutRefused::class);

        $this->expectExceptionMessage(
            LayoutRefused::tooManyRows('root', count($rows), LayoutPartData::ROW_LIMIT)->getMessage(),
        );

        DeclaredLayoutData::build()
            ->root(LayoutPartData::build()->asCollection()->key('rows')->style('list')->rows($rows)->finish())
            ->finish();
    }

    public function test_a_skeleton_carries_its_placeholder_rows_and_a_plain_notice_may_not_claim_that_style(): void
    {
        $skeleton = LayoutPartData::build()
            ->asSkeleton()
            ->key('loading')
            ->placeholders(3)
            ->label('Loading tasks')
            ->finish();

        $this->assertSame(1, $skeleton->assertWithinCatalogue());
        $this->assertSame(3, $skeleton->placeholders);
        $this->assertSame('skeleton', $skeleton->style);

        $this->expectException(LayoutRefused::class);

        DeclaredLayoutData::build()
            ->root(
                LayoutPartData::build()
                ->asNotice()
                ->key('loading')
                ->style('skeleton')
                ->title('Loading tasks')
                ->finish(),
            )
            ->finish();
    }

    public function test_a_stale_notice_holds_its_reason_in_the_notice_style_of_that_name(): void
    {
        $stale = LayoutPartData::build()->asStale()->key('stale')->text('Offline')->finish();

        $this->assertSame(1, $stale->assertWithinCatalogue());
        $this->assertSame('stale', $stale->style);
        $this->assertSame('Offline', $stale->text);
    }

    public function test_the_parts_that_lead_and_trail_a_row_count_and_are_checked_with_the_layout(): void
    {
        $row = LayoutRowData::build()
            ->key('run-1')
            ->label('Run 1')
            ->leading(
                [LayoutPartData::build()
                ->asText()
                ->key('driver')
                ->value('Claude')
                ->style('driver')
                ->finish()],
            )
            ->trailing(
                [LayoutPartData::build()->asBadge()->key('state')->text('Running')->tone('busy')->finish()],
            )
            ->finish();

        $this->assertSame(3, LayoutPartData::build()
            ->asCollection()
            ->key('rows')
            ->style('list')
            ->rows([$row])
            ->finish()->assertWithinCatalogue());

        $this->expectException(LayoutRefused::class);

        $unknown = LayoutRowData::build()
            ->key('run-2')
            ->label('Run 2')
            ->trailing(
                [LayoutPartData::build()
                ->asText()
                ->key('state')
                ->value('Running')
                ->style('unheard')
                ->finish()],
            )
            ->finish();

        LayoutPartData::build()->asCollection()->key('rows')->style('list')->rows([$unknown])->finish()->assertWithinCatalogue();
    }

    public function test_a_fact_value_holds_pieces_that_link_only_when_they_have_an_address(): void
    {
        $value = LayoutFactValueData::build()->linkedPieces([['Task 3', '/tasks/3'], ['Task 4', null]])->finish();

        $this->assertSame('/tasks/3', $value->pieces[0]->href);
        $this->assertInstanceOf(Optional::class, $value->pieces[1]->href);
    }

    public function test_a_dialog_holds_its_opener_then_its_form_with_the_footer_that_sends_it(): void
    {
        $dialog = LayoutPartData::build()
            ->asDialog()
            ->key('create')
            ->dialog(LayoutDialogData::build()->title('Create task')->confirmation('Task created')->finish())
            ->opener(
                LayoutPartData::build()
                ->asAction()
                ->key('open')
                ->label('Create task')
                ->action(LayoutActionData::build()->query([])->finish())
                ->finish(),
            )
            ->sheet(
                LayoutFormData::build()->method(ActionMethod::Post)->href('/tasks')->isKeyed(true)->finish(),
                [LayoutPartData::build()
                ->asField()
                ->key('title')
                ->label('Title')
                ->field(LayoutFieldData::build()->name('title')->finish())
                ->style('text')
                ->finish()],
                [LayoutPartData::build()
                ->asAction()
                ->key('send')
                ->label('Create')
                ->action(LayoutActionData::build()->submits(true)->finish())
                ->style('primary')
                ->finish()],
            )
            ->finish();

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
        $meter = LayoutPartData::build()
            ->asProgress()
            ->key('week')
            ->progress(
                LayoutProgressData::build()
                ->value(72)
                ->max(100)
                ->label('Weekly allowance')
                ->unit('percent')
                ->finish(),
            )
            ->finish();
        $counted = LayoutPartData::build()
            ->asProgress()
            ->key('tasks')
            ->progress(LayoutProgressData::build()->value(3)->max(8)->label('Plan 4')->unit('tasks')->finish())
            ->style('counted')
            ->finish();

        $this->assertSame(1, $meter->assertWithinCatalogue());
        $this->assertSame('meter', $meter->style);
        $this->assertSame('counted', $counted->style);
        $this->assertSame(72.0, $meter->progress->value);
        $this->assertSame(8.0, $counted->progress->max);
    }

    public function test_a_usage_part_is_a_meter_with_its_percent_and_in_a_row_carries_its_tip(): void
    {
        $reader = LayoutPartData::build()
            ->asUsage()
            ->key('week')
            ->progress(
                LayoutProgressData::build()
                ->value(72)
                ->max(100)
                ->label('This week used')
                ->unit('percent')
                ->finish(),
            )
            ->finish();
        $row = LayoutPartData::build()
            ->asUsage()
            ->key('usage')
            ->progress(
                LayoutProgressData::build()
                ->value(72)
                ->max(100)
                ->label('Usage')
                ->unit('percent')
                ->finish(),
            )
            ->tip('This week 72% used')
            ->finish();

        $this->assertSame(1, $reader->assertWithinCatalogue());
        $this->assertSame(['usage', null], [$reader->style, $reader->detail]);
        $this->assertSame(['usage-row', 'This week 72% used'], [$row->style, $row->detail]);
        $this->assertSame(100.0, $row->progress->max);
    }

    public function test_a_share_part_is_a_short_meter_of_the_pieces_finished(): void
    {
        $share = LayoutPartData::build()
            ->asShare()
            ->key('progress')
            ->progress(LayoutProgressData::build()->value(3)->max(8)->label('Plan 4')->unit('tasks')->finish())
            ->finish();

        $this->assertSame(1, $share->assertWithinCatalogue());
        $this->assertSame('share', $share->style);
        $this->assertSame([3.0, 8.0], [$share->progress->value, $share->progress->max]);
    }
}
