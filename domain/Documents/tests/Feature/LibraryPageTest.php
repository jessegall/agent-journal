<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Commands\CreateReport;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

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

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    public function test_each_record_opens_its_own_page_and_each_type_keeps_its_form(): void
    {
        $this->file();

        $this->actingAs($this->owner)
            ->get('/documents')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('layout/DeclaredLayout')
                ->where('page.data.root.children.2.children.0.rows.1.isCurrent', false)
                ->where('page.data.root.children.2.children.1.rows.0.isCurrent', true)
                ->where('page.data.root.children.3.key', 'documents')
                ->where('page.data.root.children.3.children.1.rows.0.label', 'doc 1 · Design')
                ->where('page.data.root.children.3.children.1.rows.0.detail', 'What we build')
                ->where('page.data.root.children.3.children.1.rows.0.href', '/documents/docs/1')
                ->where('page.data.root.children.3.children.2.native.component', 'documents/CreateRecordForm')
                ->where('page.data.root.children.3.children.2.native.props.action', '/documents/docs')
                ->where('page.data.root.children.4.children.1.rows.0.href', '/documents/reports/1'));
    }

    public function test_the_reports_choice_lists_only_reports(): void
    {
        $this->file();

        $this->actingAs($this->owner)
            ->get('/documents?type=report')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.2.children.0.rows.2.isCurrent', true)
                ->where('page.data.root.children.3.key', 'reports')
                ->missing('page.data.root.children.4'));
    }

    public function test_a_search_that_finds_nothing_names_itself_and_offers_to_clear_it(): void
    {
        $this->file();

        $this->actingAs($this->owner)
            ->get('/documents?query=absent')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.3.children.0.text', 'Nothing matches "absent".')
                ->where('page.data.root.children.3.children.1.action.query', ['query' => '', 'after' => '']));
    }

    public function test_a_fresh_library_says_why_it_is_empty(): void
    {
        $this->actingAs($this->owner)
            ->get('/documents')
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.3.text', 'No documents or reports yet.'));
    }

    private function file(): void
    {
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );
        $this->app->make(CommandBus::class)->run(new CreateDocument('Design', 'What we build', "Text\n"));
        $this->app->make(CommandBus::class)->run(new CreateReport('Evidence', 'First run.', 'Filed text.'));
        $this->app->make(CurrentActorSetter::class)->clear();
    }
}
