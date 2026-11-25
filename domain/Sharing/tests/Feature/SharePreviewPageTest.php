<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Models\Records\Link;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\GatewaySettings;
use App\Values\OwnerAuthority;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Models\Document;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\SharePreview;
use Domain\Sharing\Tests\TestCase;
use Tests\Support\CommitsHookRows;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The owner's share preview page: a plan's page offers Share to the owner, the preview lists the plan's linked
 * document with the provider notice beside it, and saving selects it; anyone else gets neither.
 */
#[TimeLimit(
    seconds: 5,
    reason: 'It commits a document through the bus and renders pages, and empties thirteen tables around each test.',
)]
final class SharePreviewPageTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'links',
        'share_previews',
        'share_gateway_configurations',
        'comments',
        'document_closes',
        'document_drafts',
        'reports',
        'document_revisions',
        'documents',
        'phases',
        'plans',
        'number_groups',
    ];

    private User $owner;

    private Plan $plan;

    private Document $document;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->app->make(CurrentActorSetter::class)->set(
            ActorContext::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );
        $this->app->make(CommandBus::class)->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT));
        $this->document = Document::query()->where('number', 1)->sole();
        $this->plan = Plan::factory()->create([
            'title' => 'Version 6',
            'type' => PlanType::Build,
        ]);
        Link::createForModels($this->plan, $this->document);
        $this->app->make(CurrentActorSetter::class)->clear();
        $configuration = ShareGatewayConfiguration::create(
            new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []),
        );
        $configuration->is_default = true;
        $configuration->save();
    }

    public function test_another_user_can_neither_see_nor_save_a_preview(): void
    {
        $other = User::factory()->create();

        $this->assertFalse(
            $this->actingAs($other)->get('/sharing/'.rawurlencode("plan {$this->plan->number}"))->isOk(),
        );
        $this->assertFalse(
            $this->actingAs($other)->post(
                '/sharing/'.rawurlencode("plan {$this->plan->number}").'/previews',
                ['selected' => []],
            )->isSuccessful(),
        );
        $this->assertSame(0, SharePreview::query()->count());
    }
}
