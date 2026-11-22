<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Bus\Contracts\CommandBus;
use App\Domains\Support\DomainEntry;
use App\Http\Requests\Web\DeclaredPageRequest;
use App\Http\Support\Web\PageProps;
use App\Ui\Declarations\Page;
use App\Ui\Declarations\Section;
use App\Ui\Declarations\Slot;
use App\Ui\Enums\Icon;
use App\Ui\Enums\SlotContextType;
use App\Ui\Support\UiDeclarations;
use App\Web\Data\DeniedWindow;
use App\Web\Data\FailedWindow;
use App\Web\Data\ReadyWindow;
use App\Web\Data\UnavailableWindow;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Models\Document;
use Illuminate\Validation\ValidationException;
use Tests\Fixtures\UiDeclarations\Desk\NotesResolver;
use Tests\Fixtures\UiDeclarations\Library\NobodySees;
use Tests\Fixtures\UiDeclarations\Shelf\BrokenResolver;
use Tests\Fixtures\UiDeclarations\Shelf\ReaderCalls;
use Tests\Fixtures\UiDeclarations\Shelf\RecordNotesResolver;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfDomain;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfResolver;
use Tests\Support\RefreshHookDatabase;
use Tests\Support\StartsAgentRequests;
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
    use StartsAgentRequests;

    private ReaderCalls $calls;

    protected function setUp(): void
    {
        parent::setUp();

        $this->calls = new ReaderCalls();
        $this->app->instance(ReaderCalls::class, $this->calls);
        $this->app->instance(UiDeclarations::class, $this->declarations());
        $this->startTestUserRequest(1);
    }

    public function test_a_hidden_window_gives_a_denied_result_without_calling_its_reader(): void
    {
        $result = $this->homeProp('/?window[shelf.hidden][q]=oak', 'window_shelf_hidden');

        $this->assertInstanceOf(DeniedWindow::class, $result);
        $this->assertSame([], $this->calls->readers);
    }

    public function test_a_window_reads_only_its_own_part_of_homes_query(): void
    {
        $result = $this->homeProp('/?window[shelf.shelves][q]=oak&q=elsewhere', 'window_shelf_shelves');

        $this->assertInstanceOf(ReadyWindow::class, $result);
        $this->assertSame(['oak', '', TestIds::of(1)], $result->windowFields['titles']);
        $this->assertSame($result->windowFields, $result->toArray()['data']);
    }

    public function test_two_copies_of_one_window_each_read_their_own_part_of_homes_query(): void
    {
        $request = DeclaredPageRequest::create(
            '/?window[shelf.shelves][q]=oak&window[shelf.shelves~a1b2c3d4e5f6][q]=pine&window[shelf.shelves~0f0f0f0f0f0f][q]=elm',
        );
        $request->headers->set('X-Inertia-Partial-Data', 'window_shelf_shelves__a1b2c3d4e5f6,window_shelf_shelves__0f0f0f0f0f0f,window_shelf_shelves__not-a-copy');
        $props = $this->app->make(PageProps::class)->forHome($request);

        $this->assertArrayNotHasKey('window_shelf_shelves__not-a-copy', $props);
        $this->assertSame('oak', ($props['window_shelf_shelves'])()->windowFields['titles'][0]);
        $this->assertSame('pine', ($props['window_shelf_shelves__a1b2c3d4e5f6'])()->windowFields['titles'][0]);
        $this->assertSame('elm', ($props['window_shelf_shelves__0f0f0f0f0f0f'])()->windowFields['titles'][0]);
    }

    public function test_home_serves_no_more_than_its_copy_limit_of_one_window(): void
    {
        $asked = array_map(fn (int $copy) => sprintf('window_shelf_shelves__%012x', $copy), range(1, DeclaredPageRequest::COPY_LIMIT + 3));
        $request = DeclaredPageRequest::create('/');
        $request->headers->set('X-Inertia-Partial-Data', implode(',', $asked));

        $copies = array_filter(
            array_keys($this->app->make(PageProps::class)->forHome($request)),
            fn (string $prop) => str_starts_with($prop, 'window_shelf_shelves__'),
        );

        $this->assertCount(DeclaredPageRequest::COPY_LIMIT, $copies);
    }

    public function test_a_window_query_its_request_refuses_is_a_validation_error_not_a_failed_window(): void
    {
        $this->expectException(ValidationException::class);

        $this->homeProp('/?window[shelf.shelves][q]='.str_repeat('x', 30), 'window_shelf_shelves');
    }

    public function test_a_failing_section_leaves_the_page_and_its_other_sections_whole(): void
    {
        $props = $this->pageProps('/shelf');

        $this->assertInstanceOf(ReadyWindow::class, ($props['page'])());
        $broken = ($props['section_shelf_aside_shelf_broken'])();
        $this->assertInstanceOf(FailedWindow::class, $broken);
        $this->assertSame(FailedWindow::MESSAGE, $broken->message);
        $this->assertInstanceOf(ReadyWindow::class, ($props['section_shelf_aside_shelf_notes'])());
        $this->assertInstanceOf(DeniedWindow::class, ($props['section_shelf_aside_shelf_secret'])());
    }

    public function test_the_inspector_reads_its_record_from_the_query(): void
    {
        $inspector = ($this->pageProps('/shelf?inspect=shelf.shelf&shelf=7')['inspector'])();

        $this->assertInstanceOf(ReadyWindow::class, $inspector);
        $this->assertSame('7', $inspector->windowFields['titles'][1]);
    }

    public function test_a_section_on_the_inspected_record_reads_that_record_by_its_number(): void
    {
        $this->app->make(CommandBus::class)->run(new CreateDocumentCommand('Design', 'What we build', "# Design\n"));
        $document = Document::query()->where('number', 1)->sole();

        $section = ($this->pageProps('/shelf?inspect=shelf.shelf&shelf=1')['inspector_section_shelf_margin_shelf_record'])();

        $this->assertInstanceOf(ReadyWindow::class, $section);
        $this->assertSame([(string) $document->id], $section->windowFields['titles']);
    }

    public function test_a_section_on_a_record_the_user_cannot_read_is_unavailable(): void
    {
        $section = ($this->pageProps('/shelf?inspect=shelf.shelf&shelf=7')['inspector_section_shelf_margin_shelf_record'])();

        $this->assertInstanceOf(UnavailableWindow::class, $section);
    }

    public function test_a_page_with_no_record_open_mounts_no_record_section(): void
    {
        $this->assertArrayNotHasKey('inspector_section_shelf_margin_shelf_record', $this->pageProps('/shelf'));
    }

    public function test_two_users_in_a_row_each_get_their_own_result(): void
    {
        $first = $this->homeProp('/', 'window_shelf_shelves');
        $this->app->forgetScopedInstances();
        $this->startTestUserRequest(2);
        $second = $this->homeProp('/', 'window_shelf_shelves');

        $this->assertInstanceOf(ReadyWindow::class, $first);
        $this->assertInstanceOf(ReadyWindow::class, $second);
        $this->assertSame(TestIds::of(1), $first->windowFields['titles'][2]);
        $this->assertSame(TestIds::of(2), $second->windowFields['titles'][2]);
    }

    private function homeProp(string $url, string $prop): mixed
    {
        $props = $this->app->make(PageProps::class)->forHome(DeclaredPageRequest::create($url));

        return ($props[$prop])();
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
