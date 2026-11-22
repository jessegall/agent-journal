<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\CommandBus;
use App\Contracts\CurrentActorSetter;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Tests\TestCase;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;

/**
 * A numbered revision of a document is reached by its own address and shown as a publication: which revision of
 * which document it is, its abstract and its text once, and an unknown revision answers not found.
 */
final class RevisionPageTest extends TestCase
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

        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );

        $this->app->make(CommandBus::class)->run(new CreateDocumentCommand('Design', 'What we build', "# Goal\nShip it.\n"));
        $this->app->make(CurrentActorSetter::class)->clear();
    }

    public function test_a_revision_shows_which_one_it_is_and_its_text_once(): void
    {
        $this->actingAs($this->owner)
            ->get('/documents/docs/1/revisions/1')
            ->assertOk()
            ->assertInertia(fn (AssertableInertia $page) => $page
                ->component('layout/DeclaredLayout')
                ->where('page.data.root.children.0.children.0.text', 'Design')
                ->where('page.data.root.children.0.children.1.children.0.text', 'doc 1, revision 1')
                ->where('page.data.root.children.0.children.1.children.1.style', 'time')
                ->where('page.data.root.children.0.children.1.children.1.text', 'Saved')
                ->missing('page.data.root.children.0.children.1.children.2')
                ->where('page.data.root.children.0.children.2.text', 'What we build')
                ->where('page.data.root.children.1.tag', 'body'));
    }

    public function test_an_unknown_revision_is_not_found(): void
    {
        $this->actingAs($this->owner)->get('/documents/docs/1/revisions/9')->assertNotFound();
    }
}
