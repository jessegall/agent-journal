<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Declarations\ActionRoute;
use App\Declarations\ChoiceOption;
use App\Declarations\FloatSize;
use App\Declarations\Page;
use App\Declarations\PageActions;
use App\Declarations\PageLoaders;
use App\Declarations\PageSlots;
use App\Declarations\PaneChoice;
use App\Declarations\SlotContext;
use App\Declarations\ToggleOption;
use App\Navigation\Declarations\Loader;
use App\Navigation\Declarations\NavigationItem;
use App\Navigation\Enums\Icon;
use App\Navigation\Exceptions\InvalidNavigationDeclaration;
use App\Profiles\Enums\SlotContextType;
use App\Settings\Enums\ActionMethod;
use App\Text\Declarations\Section;
use App\Text\Exceptions\InvalidSectionDeclaration;
use App\Web\Attributes\Deferred;
use App\Web\Creation\Exceptions\InvalidSurfacePolicy;
use App\Web\Creation\SurfacePropPolicy;
use App\Web\Declarations\Slot;
use App\Web\Enums\PageDestination;
use App\Web\Enums\PageSkeleton;
use App\Web\Exceptions\InvalidPageDeclaration;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\ClientDeclarations\LooseResolver;
use Tests\Fixtures\ClientDeclarations\RecentNotesData;
use Tests\Fixtures\ClientDeclarations\RecentNotesResolver;
use Tests\Support\TestIds;
use ValueError;

/**
 * The values a domain declares its pages, navigation and sections with: immutable, typed, and refused at once when
 * they cannot be right on their own.
 */
final class ClientDeclarationValuesTest extends TestCase
{
    public function test_a_prop_cannot_be_deferred_and_optional(): void
    {
        $this->expectExceptionObject(InvalidSurfacePolicy::at('Books', 'A prop cannot be both optional and deferred.'));

        new SurfacePropPolicy('Books', new Deferred('books'), true, null);
    }

    public function test_a_pages_scoped_parts_are_the_parts_their_values_declare_in_the_order_added(): void
    {
        $page = Page::make('plan', 'Plan', Icon::Plan, RecentNotesResolver::class, 'PlanResolver.vue')
            ->slots(fn (PageSlots $slots) => $slots
                ->add('bar', SlotContextType::Nothing)
                ->record('inspector', 'plan', 'plan'))
            ->actions(fn (PageActions $actions) => $actions
                ->get('read', LooseResolver::class, 'read')
                ->post('start', LooseResolver::class, 'start')
                ->patch('rename', LooseResolver::class, 'rename')
                ->delete('drop', LooseResolver::class, 'drop'))
            ->loaders(fn (PageLoaders $loaders) => $loaders->add('rows', RecentNotesResolver::class));

        $this->assertEquals(
            [
                [Slot::make('bar', SlotContextType::Nothing), Slot::record('inspector', 'plan', 'plan')],
                [
                    ActionRoute::get('read', LooseResolver::class, 'read'),
                    ActionRoute::post('start', LooseResolver::class, 'start'),
                    ActionRoute::patch('rename', LooseResolver::class, 'rename'),
                    ActionRoute::delete('drop', LooseResolver::class, 'drop'),
                ],
                [Loader::make('rows', RecentNotesResolver::class)],
            ],
            [$page->slots, $page->actions, $page->loaders],
        );
    }

    public function test_a_parameterised_page_records_its_reader_data_class_slots_and_actions(): void
    {
        $page = Page::make('plan', 'Plan', Icon::Plan, RecentNotesResolver::class, 'PlanResolver.vue')
            ->at('{plan}')
            ->inInspector()
            ->loadingAs(PageSkeleton::Reader)
            ->onHome(20)
            ->floating(FloatSize::of(400, 500))
            ->options(
                ToggleOption::make('wide', 'Wide'),
                ChoiceOption::make(
                    'sort',
                    'Sort',
                    [new PaneChoice('new', 'Newest'), new PaneChoice('old', 'Oldest')],
                    'new',
                ),
            )
            ->slots(fn (PageSlots $slots) => $slots->record('inspector', 'plan', 'plan'))
            ->actions(fn (PageActions $actions) => $actions->post('start', LooseResolver::class, 'start'));

        $this->assertSame('{plan}', $page->path);
        $this->assertSame(RecentNotesData::class, $page->dataClass);
        $this->assertSame(PageDestination::Inspector, $page->opensIn);
        $this->assertSame(PageSkeleton::Reader, $page->skeleton);
        $this->assertSame(20, $page->homePosition);
        $this->assertSame([400, 500], [$page->floatSize->width, $page->floatSize->height]);
        $this->assertSame(['wide', 'sort'], array_map(fn ($option) => $option->key(), $page->options));
        $this->assertSame(
            [SlotContextType::Record, 'plan'],
            [$page->slots[0]->takes, $page->slots[0]->recordParameter],
        );
        $this->assertSame(
            [ActionMethod::Post, 'start', 'start'],
            [$page->actions[0]->method, $page->actions[0]->path, $page->actions[0]->name],
        );
    }

    public function test_a_page_starts_at_its_own_key_off_home_and_a_change_leaves_the_original_untouched(): void
    {
        $page = Page::make('list', 'Plans', Icon::Plan, RecentNotesResolver::class, 'PlansView.vue');
        $moved = $page->at('');

        $this->assertSame('list', $page->path);
        $this->assertSame('', $moved->path);
        $this->assertNull($page->homePosition);
        $this->assertSame([], $page->slots);
        $this->assertSame(PageDestination::Page, $page->opensIn);
    }

    public function test_a_reader_without_a_concrete_data_return_type_is_refused(): void
    {
        $this->expectExceptionObject(InvalidPageDeclaration::resolverReturnsNoData('list', LooseResolver::class));

        Page::make('list', 'Plans', Icon::Plan, LooseResolver::class, 'PlansView.vue');
    }

    public function test_a_record_slot_needs_its_route_parameter(): void
    {
        $this->expectExceptionObject(InvalidPageDeclaration::recordSlotWithoutParameter('inspector'));

        Slot::make('inspector', SlotContextType::Record);
    }

    public function test_a_choice_must_start_on_one_of_its_choices(): void
    {
        $this->expectExceptionObject(InvalidPageDeclaration::unknownChoice('sort', 'size'));

        ChoiceOption::make('sort', 'Sort', [new PaneChoice('new', 'Newest')], 'size');
    }

    public function test_a_float_size_must_be_positive(): void
    {
        $this->expectExceptionObject(InvalidPageDeclaration::floatSizeNotPositive(0, 300));

        FloatSize::of(0, 300);
    }

    public function test_navigation_nests_static_children_with_query_values_and_a_children_reader(): void
    {
        $plans = NavigationItem::page('list', 'Plans', Icon::Plan, group: 'web.work', position: 200)
            ->count(LooseResolver::class)
            ->children([
                NavigationItem::page('open', 'Open', page: 'list', query: ['state' => 'open']),
                NavigationItem::page('closed', 'Closed', page: 'list', query: ['state' => 'closed']),
            ]);
        $collections = NavigationItem::heading('collections', 'Collections', childrenResolver: LooseResolver::class);

        $this->assertSame('list', $plans->page);
        $this->assertSame('web.work', $plans->group);
        $this->assertSame(['open', 'closed'], array_map(fn (NavigationItem $child) => $child->key, $plans->children));
        $this->assertSame(['state' => 'open'], $plans->children[0]->queryValues);
        $this->assertSame('list', $plans->children[0]->page);
        $this->assertNull($collections->page);
        $this->assertSame(LooseResolver::class, $collections->childrenResolver);
    }

    public function test_an_item_with_nothing_to_open_is_refused(): void
    {
        $this->expectExceptionObject(InvalidNavigationDeclaration::nothingToOpen('empty'));

        NavigationItem::heading('empty', 'Empty');
    }

    public function test_route_values_must_be_strings(): void
    {
        $this->expectExceptionObject(InvalidNavigationDeclaration::valuesNotStrings('year', 'route'));

        NavigationItem::page('year', '2026', page: 'collection', route: ['year' => 2026]);
    }

    public function test_a_child_with_a_group_or_at_the_bottom_is_refused(): void
    {
        $this->expectExceptionObject(InvalidNavigationDeclaration::rootOnlyOnChild('list', 'settings'));

        NavigationItem::page('list', 'Plans')->children([NavigationItem::page('settings', 'Settings')->atBottom()]);
    }

    public function test_a_section_names_its_slot_by_full_key_and_records_its_reader_data_class(): void
    {
        $section = Section::make(
            'on-plan',
            'Notes',
            'plans.inspector',
            SlotContextType::Record,
            RecentNotesResolver::class,
            'OnPlan.vue',
        )->at(5);

        $this->assertSame(RecentNotesData::class, $section->dataClass);
        $this->assertSame(5, $section->position);
        $this->assertSame('plans.inspector', $section->slot);
    }

    public function test_a_section_with_a_local_slot_key_is_refused(): void
    {
        $this->expectExceptionObject(InvalidSectionDeclaration::slotNotFullKey('on-plan', 'inspector'));

        Section::make(
            'on-plan',
            'Notes',
            'inspector',
            SlotContextType::Record,
            RecentNotesResolver::class,
            'OnPlan.vue',
        );
    }

    public function test_a_slot_context_carries_a_decimal_id_only_for_a_session_or_record(): void
    {
        $this->assertNull(SlotContext::nothing()->id);
        $this->assertSame(
            [SlotContextType::Session, TestIds::of(12)],
            [SlotContext::session(TestIds::of(12))->type, SlotContext::session(TestIds::of(12))->id],
        );
        $this->assertSame(
            [SlotContextType::Record, TestIds::of(7)],
            [SlotContext::record(TestIds::of(7))->type, SlotContext::record(TestIds::of(7))->id],
        );
    }

    public function test_an_icon_the_host_does_not_draw_is_refused(): void
    {
        $this->assertSame(Icon::Docs, Icon::from('docs'));

        $this->expectException(ValueError::class);

        Icon::from('rocket');
    }
}
