<?php

declare(strict_types=1);

namespace Domain\Documents\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Values\OwnerAuthority;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Tests\TestCase;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;

/**
 * A document opens in the library's reader beside the list, as a publication: its number and revision in the header, the Text, Links, Details and History
 * tabs of which only the chosen one is read, History linking each revision, an unknown tab falling back to the first,
 * and the editing part under the header on every tab, so a held draft survives a tab change.
 */
final class DocumentPageTest extends TestCase
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

        $this->app->make(CommandBus::class)->run(
            new CreateDocumentCommand('Design', 'What we build', "# Goal\nShip it.\n"),
        );

        $this->app->make(CurrentActorSetter::class)->clear();
    }

    public function test_the_held_draft_stays_under_the_header_on_every_tab(): void
    {
        $this->actingAs($this->owner)->post('/documents/docs/1/open')->assertRedirect();

        foreach ([
            'text',
            'links',
            'details',
            'history',
        ] as $tab) {
            $this->actingAs($this->owner)
                ->get("/documents/docs/1?tab={$tab}")
                ->assertOk()
                ->assertInertia(fn (AssertableInertia $page) => $page
                    ->where('page.data.root.children.1.children.1.children.4.key', 'editing')
                    ->where('page.data.root.children.1.children.1.children.4.native.component', 'documents/DraftEditor')
                    ->where('page.data.root.children.1.children.1.children.4.native.props.number', '1')
                    ->where('page.data.root.children.1.children.1.children.4.native.props.draft.title', 'Design'));
        }
    }
}
