<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Core\Ui\Declarations\Page;
use App\Core\Ui\Declarations\Section;
use App\Core\Ui\Declarations\Slot;
use App\Core\Ui\Enums\Icon;
use App\Core\Ui\Enums\SlotContextKind;
use App\Core\Ui\Support\UiDeclarations;
use App\Core\Web\Data\DeniedWindow;
use App\Core\Web\Data\FailedWindow;
use App\Core\Web\Data\ReadyWindow;
use App\Core\Web\Http\PageProps;
use App\Core\Web\Http\Requests\DeclaredPageRequest;
use App\Domain\DomainEntry;
use Illuminate\Validation\ValidationException;
use Tests\Fixtures\UiDeclarations\Desk\NotesReader;
use Tests\Fixtures\UiDeclarations\Library\NobodySees;
use Tests\Fixtures\UiDeclarations\Shelf\BrokenReader;
use Tests\Fixtures\UiDeclarations\Shelf\ReaderCalls;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfDomain;
use Tests\Fixtures\UiDeclarations\Shelf\ShelfReader;
use Tests\Support\StartsAgentRequests;
use Tests\TestCase;

/**
 * The props of declared pages: each checks its visibility before any reader, a window reads only its part of Home's
 * query, a failing section leaves its siblings whole, the inspector reads its record from the query, and two users in
 * a row on one worker each get their own result.
 */
final class PagePropsTest extends TestCase
{
    use StartsAgentRequests;

    private ReaderCalls $calls;

    protected function setUp(): void
    {
        parent::setUp();

        $this->calls = new ReaderCalls;
        $this->app->instance(ReaderCalls::class, $this->calls);
        $this->app->instance(UiDeclarations::class, $this->declarations());
        $this->startUserRequestAs(1);
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
        $this->assertSame(['oak', '', '1'], $result->data['titles']);
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
        $this->assertSame('7', $inspector->data['titles'][1]);
    }

    public function test_two_users_in_a_row_each_get_their_own_result(): void
    {
        $first = $this->homeProp('/', 'window_shelf_shelves');
        $this->app->forgetScopedInstances();
        $this->startUserRequestAs(2);
        $second = $this->homeProp('/', 'window_shelf_shelves');

        $this->assertInstanceOf(ReadyWindow::class, $first);
        $this->assertInstanceOf(ReadyWindow::class, $second);
        $this->assertSame('1', $first->data['titles'][2]);
        $this->assertSame('2', $second->data['titles'][2]);
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
        return $this->app->make(PageProps::class)->forPage($this->app->make(UiDeclarations::class)->page('shelf.shelves'), DeclaredPageRequest::create($url));
    }

    private function declarations(): UiDeclarations
    {
        $shelf = DomainEntry::fromClass(ShelfDomain::class)->declaring(pages: [
            Page::make('shelves', 'Shelves', Icon::Docs, ShelfReader::class, 'Shelf.vue')
                ->at('')
                ->slots(Slot::make('aside', SlotContextKind::Nothing)),
            Page::make('hidden', 'Hidden', Icon::Docs, ShelfReader::class, 'Shelf.vue')
                ->at('hidden')
                ->visibleWhen(NobodySees::class),
            Page::make('shelf', 'Shelf', Icon::Docs, ShelfReader::class, 'Record/Reader.vue')
                ->at('{shelf}')
                ->inInspector(),
        ], sections: [
            Section::make('broken', 'Broken', 'shelf.aside', SlotContextKind::Nothing, BrokenReader::class, 'Aside.vue'),
            Section::make('notes', 'Notes', 'shelf.aside', SlotContextKind::Nothing, NotesReader::class, 'Aside.vue'),
            Section::make('secret', 'Secret', 'shelf.aside', SlotContextKind::Nothing, NotesReader::class, 'Aside.vue')
                ->visibleWhen(NobodySees::class),
        ]);

        return UiDeclarations::check([$shelf]);
    }
}
