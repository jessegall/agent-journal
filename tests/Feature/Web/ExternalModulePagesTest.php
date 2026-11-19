<?php

declare(strict_types=1);

namespace Tests\Feature\Web;

use App\Agents\Models\Agent;
use App\Domains\Support\DomainRegistry;
use App\Ui\Support\UiDeclarations;
use App\Web\Pages\WebPages;
use App\Web\Routes\DeclaredRoutes;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Illuminate\Routing\Router;
use Inertia\Testing\AssertableInertia;
use Tests\Fixtures\Modules\Cards\CardsDomain;
use Tests\Fixtures\Modules\Notes\Models\Note;
use Tests\Fixtures\Modules\Notes\NotesDomain;
use Tests\Support\InstallsNotesModule;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * A module outside app declares its pages, navigation and a section, and they are served, listed and read through the
 * same routes, props and navigation as the domains', with no change to Core or Web; without the module its page is
 * not found.
 */
final class ExternalModulePagesTest extends TestCase
{
    use InstallsNotesModule;
    use RefreshHookDatabase;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createNotesTables();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
    }

    protected function tearDown(): void
    {
        $this->dropNotesTables();

        parent::tearDown();
    }

    public function test_the_modules_page_and_record_page_are_served_and_listed_like_any_domains(): void
    {
        $this->installNotes();
        $writer = Agent::named('Writer', 'read-only-helper');
        $note = new Note(['text' => 'Check the lock order']);
        $note->saveFor($writer->id);
        $month = $note->created_at?->format('Y-m');

        $this->actingAs($this->owner)->get('/notes')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('notes/Index')
            ->where('page.state', 'ready')
            ->where('page.data.texts', ['Check the lock order'])
            ->where('navigation.items', fn ($items) => collect($items)->contains(fn ($item) => $item['key'] === 'notes.index'
                && $item['children'][0]['children'][0]['url'] === "/notes/collections/{$month}")));

        $this->actingAs($this->owner)->get(
            "/notes/collections/{$month}",
        )->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
                    ->component('notes/Collection')
                    ->where('page.data.collection', $month)
                    ->where('page.data.texts', ['Check the lock order']));
        $this->actingAs($this->owner)->get('/notes/collections/not-a-month')->assertNotFound();
    }

    public function test_without_the_module_its_page_is_not_found(): void
    {
        $this->actingAs($this->owner)->get('/notes')->assertNotFound();
    }

    /**
     * Installs the module as a deploy would: the registry with it, the checked declarations and their routes.
     */
    private function installNotes(): void
    {
        $domainClasses = DomainRegistry::installedClasses(base_path());
        $declarations = DomainRegistry::from(
            [...$domainClasses, CardsDomain::class, NotesDomain::class],
        )->uiDeclarations(new WebPages()->declarations());
        $this->app->instance(UiDeclarations::class, $declarations);
        $router = $this->app->make(Router::class);
        new DeclaredRoutes($declarations)->register($router);
        $router->getRoutes()->refreshNameLookups();
        $this->installNotesModule();
    }
}
