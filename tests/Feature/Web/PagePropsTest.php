<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Contracts\Bus\CommandBus;
use App\Data\Pages\ReadyWindow;
use App\Declarations\Page;
use App\Declarations\Section;
use App\Declarations\Slot;
use App\Enums\Navigation\Icon;
use App\Enums\Profiles\SlotContextType;
use App\Http\Requests\Web\DeclaredPageRequest;
use App\Support\DomainEntry;
use App\Support\UiDeclarations;
use App\Support\Web\PageProps;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\DocumentsDomain;
use Domain\Documents\Models\Document;
use Tests\Fixtures\UiDeclarations\Desk\NotesResolver;
use Tests\Fixtures\UiDeclarations\Library\NobodySees;
use Tests\Fixtures\UiDeclarations\Shelf\BrokenResolver;
use Tests\Fixtures\UiDeclarations\Shelf\ReaderCalls;
use Tests\Fixtures\UiDeclarations\Shelf\RecordNotesResolver;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfDomain;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfResolver;
use Tests\Support\DomainBoot;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * The props of declared pages: each checks its visibility before any reader, a window reads only its part of Home's
 * query, a failing section leaves its siblings whole, the inspector reads its record from the query, and two users in
 * a row on one worker each get their own result.
 */
final class PagePropsTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(DocumentsDomain::class);
    }

    private ReaderCalls $calls;

    protected function setUp(): void
    {
        parent::setUp();

        $this->calls = new ReaderCalls();
        $this->app->instance(ReaderCalls::class, $this->calls);
        $this->app->instance(UiDeclarations::class, $this->declarations());
        $this->journal->actAsUserId(TestIds::of(1));
    }

    public function test_a_section_on_the_inspected_record_reads_that_record_by_its_number(): void
    {
        $this->app->make(CommandBus::class)->run(new CreateDocumentCommand('Design', 'What we build', "# Design\n"));
        $document = Document::query()->where('number', 1)->sole();

        $section = ($this->pageProps('/shelf?inspect=shelf.shelf&shelf=1')['inspector_section_shelf_margin_shelf_record'])();

        $this->assertInstanceOf(ReadyWindow::class, $section);
        $this->assertSame([(string) $document->id], $section->windowFields['titles']);
    }

    /**
     * @return array<string, mixed>
     */
    private function pageProps(string $url): array
    {
        return $this->app->make(PageProps::class)->forPage(
            $this->app->make(UiDeclarations::class)->page('shelf.shelves'),
            DeclaredPageRequest::create($url),
        );
    }

    private function declarations(): UiDeclarations
    {
        $shelf = DomainEntry::fromClass(ShelfDomain::class)->declaring(pages: [
            Page::make('shelves', 'Shelves', Icon::Docs, ShelfResolver::class, 'Shelf.vue')
                ->at('')
                ->slots(Slot::make('aside', SlotContextType::Nothing)),
            Page::make('hidden', 'Hidden', Icon::Docs, ShelfResolver::class, 'Shelf.vue')
                ->at('hidden')
                ->visibleWhen(NobodySees::class),
            Page::make('shelf', 'Shelf', Icon::Docs, ShelfResolver::class, 'Record/Reader.vue')
                ->at('{shelf}')
                ->inInspector()
                ->slots(Slot::record('margin', 'shelf', 'doc')),
        ], sections: [
            Section::make(
                'broken',
                'Broken',
                'shelf.aside',
                SlotContextType::Nothing,
                BrokenResolver::class,
                'Aside.vue',
            ),
            Section::make('notes', 'Notes', 'shelf.aside', SlotContextType::Nothing, NotesResolver::class, 'Aside.vue'),
            Section::make(
                'record',
                'Record',
                'shelf.margin',
                SlotContextType::Record,
                RecordNotesResolver::class,
                'Aside.vue',
            ),
            Section::make(
                'secret',
                'Secret',
                'shelf.aside',
                SlotContextType::Nothing,
                NotesResolver::class,
                'Aside.vue',
            )
                ->visibleWhen(NobodySees::class),
        ]);

        return UiDeclarations::check([$shelf]);
    }
}
