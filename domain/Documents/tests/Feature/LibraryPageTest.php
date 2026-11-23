<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Commands\CreateReport\CreateReportCommand;
use Domain\Documents\Tests\TestCase;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;

/**
 * The library page is a declared layout: each record opens its own page, the type and attention choices mark the
 * chosen one, a search that finds nothing names itself and offers to clear it, and a fresh library says why it is
 * empty. Each type keeps its form that files a new record.
 */
final class LibraryPageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'links',
        'comments',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'number_groups',
    ];

    private const string CONTENT = 'page.data.root.children.1.children.0.children.0.children';

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_each_record_opens_its_own_page_and_each_type_keeps_its_dialog(): void
    {
        $this->file();

        $this->actingAs($this->owner)
            ->get('/documents')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('layout/DeclaredLayout')
                ->where(self::CONTENT.'.0.rows.0.label', 'doc 1 · Design')
                ->where(self::CONTENT.'.0.rows.0.detail', 'What we build')
                ->where(self::CONTENT.'.0.rows.0.href', '/documents/docs/1')
                ->where(self::CONTENT.'.0.rows.1.href', '/documents/reports/1')
                ->where('page.data.root.children.0.children.1.key', 'search')
                ->where('page.data.root.children.0.children.2.children.0.key', 'create-doc')
                ->where('page.data.root.children.0.children.2.children.1.key', 'create-report'));
    }

    public function test_the_reports_choice_lists_only_reports(): void
    {
        $this->file();

        $this->actingAs($this->owner)
            ->get('/documents?type=report')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->has(self::CONTENT.'.0.rows', 1)
                ->where(self::CONTENT.'.0.rows.0.href', '/documents/reports/1'));
    }

    public function test_a_search_that_finds_nothing_names_itself_and_offers_to_clear_it(): void
    {
        $this->file();

        $this->actingAs($this->owner)
            ->get('/documents?query=absent')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where(self::CONTENT.'.0.key', 'empty')
                ->where(self::CONTENT.'.1.children.0.key', 'clear')
                ->where(
                    self::CONTENT.'.1.children.0.action.query',
                    ['query' => '', 'attention' => 'active', 'after' => ''],
                ));
    }

    public function test_a_fresh_library_says_why_it_is_empty(): void
    {
        $this->actingAs($this->owner)
            ->get('/documents')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.1.style', 'page-empty')
                ->where('page.data.root.children.1.children.2.key', 'first-doc'));
    }

    private function file(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );

        $this->app->make(CommandBus::class)->run(new CreateDocumentCommand('Design', 'What we build', "Text\n"));
        $this->app->make(CommandBus::class)->run(new CreateReportCommand('Evidence', 'First run.', 'Filed text.'));
        $this->app->make(CurrentActorSetter::class)->clear();
    }
}
