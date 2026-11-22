<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Domains\Support\DomainRegistry;
use App\Ui\Declarations\DomainUi;
use App\Ui\Support\UiDeclarations;
use App\Web\Pages\WebPages;
use App\Web\Routes\DeclaredRoutes;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Routing\Router;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Modules\Handbook\HandbookDomain;
use Tests\Fixtures\Modules\Handbook\Support\HandbookEntries;
use Tests\Fixtures\Modules\Handbook\Values\HandbookEntry;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * The Handbook package an author installs with no Vue file and no Documents dependency: an entry found by its number
 * among its owner's entries, its Text read once and safely, its References paged by the window's cursor standalone
 * and in the inspector, the base body once when it has no tabs, and no text read for a References visit to a large
 * entry, whose payload stays within budget.
 */
final class HandbookPageTest extends TestCase
{
    use RefreshHookDatabase;

    private const string OTHER_OWNER = 'another-owner';

    private User $owner;

    private HandbookEntries $entries;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->entries = new HandbookEntries();
        $this->app->instance(HandbookEntries::class, $this->entries);
        $this->installHandbook();
    }

    public function test_the_package_declares_a_layout_page_with_no_vue_file_and_no_dependency(): void
    {
        $declarations = $this->app->make(UiDeclarations::class);
        $page = $declarations->page('handbook.entry');

        $this->assertSame([], new HandbookDomain()->requires());
        $this->assertStringEndsWith(DomainUi::DECLARED_LAYOUT, $page->componentFile);
        $this->assertSame('handbook/entries/{entry}', $page->uri);
    }

    public function test_an_entry_is_found_among_its_owners_entries_and_its_text_is_read_once_and_safely(): void
    {
        $this->addEntry(7, 'Locks', "# Locks\n\nTake them in order.\n\n<script>alert(1)</script>");
        $this->entries->add(new HandbookEntry(self::OTHER_OWNER, 7, 'Not yours', 'one', 'Another owner'), 'Hidden');
        $this->entries->add(new HandbookEntry(self::OTHER_OWNER, 9, 'Not yours', 'one', 'Another owner'), 'Hidden');

        $this->actingAs($this->owner)
            ->get('/handbook/entries/7')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('layout/DeclaredLayout')
                ->where('page.data.root.children.0.children.0.text', 'Locks')
                ->where('page.data.root.children.1.tabs.0.key', 'text')
                ->where('page.data.root.children.1.children.0.tag', 'body')
                ->where('page.data.root.children.1.children.0.body.html', fn (string $html) => ! str_contains(
                    $html,
                    '<script>',
                )));

        $this->assertSame(1, $this->entries->textReads);
        $this->assertSame(0, $this->entries->referenceReads);
        $this->actingAs($this->owner)->get('/handbook/entries/9')->assertNotFound();
    }

    public function test_references_are_paged_by_the_window_cursor_and_read_no_text(): void
    {
        foreach (range(100, 159) as $number) {
            $this->addEntry($number, "Entry {$number}", 'Text');
        }

        $this->addEntry(7, 'Locks', 'Take them in order.', range(100, 159));

        $this->actingAs($this->owner)
            ->get('/handbook/entries/7?tab=references')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.1.tabs.1.isChosen', true)
                ->count('page.data.root.children.1.children.0.children.0.rows', 50)
                ->where('page.data.root.children.1.children.0.children.0.rows.0.href', '/handbook/entries/100')
                ->where('page.data.root.children.1.children.0.children.1.action.query.cursor', '50'));

        $this->actingAs($this->owner)
            ->get('/handbook/entries/7?tab=references&cursor=50')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->count('page.data.root.children.1.children.0.children.0.rows', 10)
                ->missing('page.data.root.children.1.children.0.children.1'));

        $this->assertSame(0, $this->entries->textReads);
        $this->assertSame(2, $this->entries->referenceReads);
    }

    public function test_the_inspector_opens_the_same_layout_for_the_entry_it_names(): void
    {
        $this->addEntry(7, 'Locks', 'Take them in order.');
        $this->addEntry(8, 'Queues', 'One at a time.');

        $this->actingAs($this->owner)
            ->get('/handbook/entries/8?inspect=handbook.entry&entry=7')
            ->assertInertia(fn (AssertableInertia $page) => $page->reloadOnly(
                'inspector',
                fn (AssertableInertia $reload) => $reload
                    ->where('inspector.data.root.children.0.children.0.text', 'Locks')
                    ->where('inspector.data.root.children.1.tabs.0.key', 'text'),
            ));
    }

    public function test_an_entry_without_tabs_shows_its_base_body_once_and_references_can_be_empty_or_withheld(): void
    {
        $this->entries->add(
            new HandbookEntry($this->owner->id, 7, 'Locks', 'first', 'Lock order', hasTabs: false),
            'Take them in order.',
        );
        $this->entries->add(
            new HandbookEntry($this->owner->id, 8, 'Queues', 'first', 'Queues', sharesReferences: false),
            'One at a time.',
        );
        $this->addEntry(9, 'Alone', 'Nothing refers here.');

        $this->actingAs($this->owner)->get('/handbook/entries/7')->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.1.tag', 'body')
                ->missing('page.data.root.children.2'),
        );
        $this->assertSame(1, $this->entries->textReads);

        $this->actingAs($this->owner)->get('/handbook/entries/8')->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page->count('page.data.root.children.1.tabs', 1),
        );

        $this->actingAs($this->owner)->get('/handbook/entries/9?tab=references')->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.1.children.0.tag', 'notice')
                ->where('page.data.root.children.1.children.0.text', 'No references.'),
        );
    }

    public function test_a_large_entry_reads_no_text_for_references_and_a_bounded_slice_for_text(): void
    {
        $paragraph = str_repeat('A long line of the handbook. ', 40);
        $this->addEntry(7, 'Everything', implode("\n\n", array_fill(0, 4000, $paragraph)), [8]);
        $this->addEntry(8, 'Queues', 'One at a time.');

        $references = $this->actingAs($this->owner)->get('/handbook/entries/7?tab=references')->assertOk();

        $this->assertSame(0, $this->entries->textReads);
        $this->assertSame(1, $this->entries->referenceReads);
        $this->assertLessThan(64 * 1024, $this->pageBytes($references));

        $text = $this->actingAs($this->owner)->get('/handbook/entries/7')->assertOk();

        $this->assertSame(1, $this->entries->textReads);
        $this->assertLessThan(128 * 1024, $this->pageBytes($text));
    }

    /**
     * @param  list<int>  $references
     */
    private function addEntry(int $number, string $title, string $text, array $references = []): void
    {
        $this->entries->add(
            new HandbookEntry($this->owner->id, $number, $title, 'first', "About {$title}"),
            $text,
            $references,
        );
    }

    /**
     * The bytes of the page prop as the browser receives it, serialized uncompressed.
     */
    private function pageBytes(TestResponse $response): int
    {
        return strlen((string) json_encode($response->viewData('page')['props']['page']));
    }

    /**
     * Installs the package as a deploy would: the registry with it, the checked declarations and their routes.
     */
    private function installHandbook(): void
    {
        $declarations = DomainRegistry::from(
            [...DomainRegistry::installedClasses(base_path()), HandbookDomain::class],
        )->uiDeclarations(new WebPages()->declarations());
        $this->app->instance(UiDeclarations::class, $declarations);
        $router = $this->app->make(Router::class);
        new DeclaredRoutes($declarations)->register($router);
        $router->getRoutes()->refreshNameLookups();
    }
}
