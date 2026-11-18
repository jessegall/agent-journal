<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\SharePreview;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\ShareSelectedTarget;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Models\Document;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The owner's share preview page: a plan's page offers Share to the owner, the preview lists the plan's linked
 * document with the provider notice beside it, and saving selects it; anyone else gets neither.
 */
#[TimeLimit(seconds: 5, reason: 'It commits a document through the bus and renders pages, and empties thirteen tables around each test.')]
final class SharePreviewPageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'links', 'share_previews', 'share_gateway_configurations', 'comments', 'document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'phases', 'plans', 'number_groups'];

    private User $owner;

    private Plan $plan;

    private Document $document;

    protected function setUp(): void
    {
        parent::setUp();

        $this->withoutVite();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($this->owner->id));
        $this->app->make(CommandBus::class)->run(new CreateDocument('Design', 'What we build', "# Goal\nShip it.\n"));
        $this->document = Document::query()->where('number', 1)->sole();
        $this->plan = Plan::factory()->create(['title' => 'Version 6', 'type' => PlanType::Build]);
        $this->plan->linkTo($this->document);
        $this->app->make(CurrentActorSetter::class)->clear();
        $configuration = ShareGatewayConfiguration::configure(new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []));
        $configuration->is_default = true;
        $configuration->save();
    }

    public function test_the_owner_sees_share_and_the_preview_lists_the_linked_document(): void
    {
        $this->actingAs($this->owner)->get("/plans/{$this->plan->number}")->assertOk()->assertInertia(fn (AssertableInertia $page) => $page->where('canShare', true));

        $this->actingAs($this->owner)->get('/sharing/'.rawurlencode("plan {$this->plan->number}"))->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('sharing/SharePreview')
            ->where('page.data.rootTitle', 'Version 6')
            ->where('page.data.candidates.0.id', $this->document->id)
            ->where('page.data.candidates.0.title', 'Design')
            ->where('page.data.candidates.0.shared', false)
            ->missing('page.data.savedPreview')
            ->missing('page.data.liveShare'));
    }

    public function test_saving_the_preview_keeps_the_selected_document(): void
    {
        $this->actingAs($this->owner)
            ->post('/sharing/'.rawurlencode("plan {$this->plan->number}").'/previews', ['selected' => [$this->document->id]])
            ->assertStatus(303);

        $preview = SharePreview::query()->sole();

        $this->assertSame([$this->document->id], array_map(fn (ShareSelectedTarget $target) => $target->record->id, $preview->selection));
    }

    public function test_another_user_can_neither_see_nor_save_a_preview(): void
    {
        $other = User::factory()->create();

        $this->assertFalse($this->actingAs($other)->get('/sharing/'.rawurlencode("plan {$this->plan->number}"))->isOk());
        $this->assertFalse($this->actingAs($other)->post('/sharing/'.rawurlencode("plan {$this->plan->number}").'/previews', ['selected' => []])->isSuccessful());
        $this->assertSame(0, SharePreview::query()->count());
    }
}
