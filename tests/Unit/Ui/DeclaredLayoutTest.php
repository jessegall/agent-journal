<?php

declare(strict_types=1);

namespace Tests\Unit\Ui;

use App\Ui\Declarations\DomainUi;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Section;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;
use App\Ui\Exceptions\InvalidPageDeclaration;
use App\Ui\Exceptions\InvalidSectionDeclaration;
use App\Ui\Layout\DeclaredLayoutData;
use App\Ui\Layout\LayoutLimits;
use App\Ui\Layout\LayoutPartData;
use App\Ui\Layout\LayoutRefused;
use App\Ui\Layout\LayoutRowData;
use PHPUnit\Framework\TestCase;
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
        $this->expectExceptionMessage('does not return DeclaredLayoutData');

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
        $this->expectExceptionMessage('root.list holds two children keyed same');

        DeclaredLayoutData::of(LayoutPartData::box(
            'root',
            'stack',
            LayoutPartData::box('list', 'stack', LayoutPartData::text('same', 'a'), LayoutPartData::text('same', 'b')),
        ));
    }

    public function test_a_variant_outside_the_catalogue_is_refused(): void
    {
        $this->expectException(LayoutRefused::class);
        $this->expectExceptionMessage('has the variant shout');

        DeclaredLayoutData::of(LayoutPartData::box('root', 'stack', LayoutPartData::text('title', 'Hi', 'shout')));
    }

    public function test_a_divider_holding_children_is_refused(): void
    {
        $this->expectException(LayoutRefused::class);
        $this->expectExceptionMessage('holds children, which it does not take');

        DeclaredLayoutData::of(LayoutPartData::box('root', 'divider', LayoutPartData::text('title', 'Hi')));
    }

    public function test_a_layout_deeper_than_the_limit_is_refused(): void
    {
        $part = LayoutPartData::text('leaf', 'deep');

        foreach (range(0, LayoutLimits::DEPTH_LIMIT) as $level) {
            $part = LayoutPartData::box("level-{$level}", 'stack', $part);
        }

        $this->expectException(LayoutRefused::class);
        $this->expectExceptionMessage('sits deeper than');

        DeclaredLayoutData::of($part);
    }

    public function test_a_collection_past_its_row_limit_is_refused(): void
    {
        $rows = array_map(
            fn (int $row) => new LayoutRowData("row-{$row}", "Row {$row}", ''),
            range(0, LayoutLimits::ROW_LIMIT),
        );

        $this->expectException(LayoutRefused::class);
        $this->expectExceptionMessage('more than '.LayoutLimits::ROW_LIMIT);

        DeclaredLayoutData::of(LayoutPartData::collection('rows', 'list', $rows));
    }
}
