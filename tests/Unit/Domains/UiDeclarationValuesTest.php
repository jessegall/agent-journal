<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Ui\Declarations\ActionRoute;
use App\Ui\Declarations\ChoiceOption;
use App\Ui\Declarations\FloatSize;
use App\Ui\Declarations\NavigationItem;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\PaneChoice;
use App\Ui\Declarations\Section;
use App\Ui\Declarations\Slot;
use App\Ui\Declarations\SlotContext;
use App\Ui\Declarations\ToggleOption;
use App\Ui\Enums\ActionMethod;
use App\Ui\Enums\Icon;
use App\Ui\Enums\PageDestination;
use App\Ui\Enums\PageSkeleton;
use App\Ui\Enums\SlotContextType;
use App\Ui\Exceptions\InvalidNavigationDeclaration;
use App\Ui\Exceptions\InvalidPageDeclaration;
use App\Ui\Exceptions\InvalidSectionDeclaration;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\UiDeclarations\LooseResolver;
use Tests\Fixtures\UiDeclarations\RecentNotesData;
use Tests\Fixtures\UiDeclarations\RecentNotesResolver;
use Tests\Support\TestIds;
use ValueError;

/**
 * The values a domain declares its pages, navigation and sections with: immutable, typed, and refused at once when
 * they cannot be right on their own.
 */
final class UiDeclarationValuesTest extends TestCase
{
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
            ->slots(Slot::record('inspector', 'plan', 'plan'))
            ->actions(ActionRoute::post('start', LooseResolver::class, 'start'));

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
        $plans = NavigationItem::page('list', 'Plans', Icon::Plan, group: 'Work', position: 200)
            ->count(LooseResolver::class)
            ->children([
                NavigationItem::page('open', 'Open', page: 'list', query: ['state' => 'open']),
                NavigationItem::page('closed', 'Closed', page: 'list', query: ['state' => 'closed']),
            ]);
        $collections = NavigationItem::heading('collections', 'Collections', childrenResolver: LooseResolver::class);

        $this->assertSame('list', $plans->page);
        $this->assertSame('Work', $plans->group);
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

    public function test_a_child_with_a_group_or_at_the_foot_is_refused(): void
    {
        $this->expectExceptionObject(InvalidNavigationDeclaration::rootOnlyOnChild('list', 'settings'));

        NavigationItem::page('list', 'Plans')->children([NavigationItem::page('settings', 'Settings')->atFoot()]);
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
