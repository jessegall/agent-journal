<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Records\Link;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Models\Document;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Http\Controllers\RevealShareLinkController;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Models\SharePreview;
use Domain\Sharing\Support\ShareProposal;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Support\SessionKey;
use Inertia\Testing\AssertableInertia;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\CommitsHookRows;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The owner's share management pages: confirm a saved preview into a share, find it in the list, reveal its address
 * only through the reveal action, update its members, retry a failed share and revoke it; every write needs its
 * Idempotency-Key, and anyone else sees none of it.
 */
#[TimeLimit(
    seconds: 10,
    reason: 'It commits a document and a plan through the bus, renders pages and empties nineteen tables around each test.',
)]
final class ShareManagementPagesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'command_receipts',
        'share_audits',
        'share_members',
        'share_gateway_operations',
        'shares',
        'share_previews',
        'share_gateway_configurations',
        'share_installations',
        'users',
        'links',
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
        $configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $configuration->is_default = true;
        $configuration->save();
    }

    public function test_the_owner_confirms_a_preview_finds_the_share_and_reveals_its_address_only_on_request(): void
    {
        $share = $this->createShare();

        $list = $this->actingAs($this->owner)->get('/sharing')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->component('layout/DeclaredLayout')
            ->where('page.data.root.children.1.children.0.children.1.children.0.rows.0.key', $share->id)
            ->where('page.data.root.children.1.children.0.children.1.children.0.rows.0.value', 'pending')
            ->where('page.data.root.children.0.children.1.key', 'count')
            ->where('page.data.root.children.1.children.1.key', 'nothing-selected')
            ->where('page.data.root.children.1.split.narrowShows', 'list')
            ->where('page.data.root.children.1.split.listWidth', 430)
            ->missing('page.data.root.children.1.children.0.children.1.children.1'));
        $this->assertStringNotContainsString(FakeShareGateway::PUBLIC_ORIGIN, (string) $list->getContent());

        $share->activate();
        $detail = $this->actingAs($this->owner)->get(
            "/sharing/shares/{$share->id}",
        )->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('layout/DeclaredLayout')
            ->where('page.data.root.children.1.native.component', 'sharing/ShareControls')
            ->where('page.data.root.children.1.native.props.mayReveal', true)
            ->where('page.data.root.children.3.children.0.children.2.rows.0.key', $this->document->id));
        $this->assertStringNotContainsString(FakeShareGateway::PUBLIC_ORIGIN, (string) $detail->getContent());

        $this->actingAs($this->owner)->from("/sharing/shares/{$share->id}")->post("/sharing/shares/{$share->id}/link")
            ->assertRedirect("/sharing/shares/{$share->id}")
            ->assertSessionHas(
                SessionKey::FLASH_DATA.'.'.RevealShareLinkController::REVEALED_LINK,
                FakeShareGateway::PUBLIC_ORIGIN.'/s/'.Share::query()->findOrFail($share->id)->token_ciphertext,
            );
    }

    public function test_a_write_without_an_idempotency_key_is_refused(): void
    {
        $this->savePreview();
        $preview = SharePreview::query()->sole();

        $this->actingAs($this->owner)
            ->postJson(
                $this->rootPath().'/shares',
                [
                    'previewId' => $preview->id,
                    'previewChecksum' => $preview->checksum,
                ],
            )
            ->assertUnprocessable()
            ->assertJsonPath('code', 'invalid-input')
            ->assertJsonStructure(['fields' => ['idempotency_key']]);
        $this->assertSame(0, Share::query()->count());
    }

    public function test_the_owner_updates_the_members_retries_a_failed_share_and_revokes_it(): void
    {
        $share = $this->createShare();
        $this->savePreview([]);
        $preview = SharePreview::query()->whereNull('consumed_at')->sole();

        $this->write(
            'post',
            "/sharing/shares/{$share->id}/scope",
            [
                'previewId' => $preview->id,
                'previewChecksum' => $preview->checksum,
            ],
        )->assertStatus(303);
        $this->assertSame(Share::FIRST_SCOPE_VERSION + 1, Share::query()->findOrFail($share->id)->scope_version);

        $failed = Share::query()->findOrFail($share->id);
        $failed->status = ShareStatus::Failed;
        $failed->save();
        $this->write('post', "/sharing/shares/{$share->id}/retry")->assertStatus(303);
        $this->assertSame(2, ShareGatewayOperation::query()->where('type', GatewayOperationType::Open->value)->count());

        $this->write('delete', "/sharing/shares/{$share->id}")->assertStatus(303);
        $this->assertSame(ShareStatus::Revoked, Share::query()->findOrFail($share->id)->status);
        $this->actingAs($this->owner)->postJson("/sharing/shares/{$share->id}/link")->assertNotFound();
    }

    public function test_the_owner_approves_a_proposal_from_a_saved_preview(): void
    {
        $proposal = Share::create(
            $this->plan->shareIdentity(),
            CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS),
            new ShareProposal(ActorIdentity::ofClass(Agent::class, $this->owner->id)),
        );
        $this->savePreview();

        $this->actingAs($this->owner)->get($this->rootPath())->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->where('page.data.openProposals.0.id', $proposal->id));
        $preview = SharePreview::query()->sole();
        $this->write(
            'post',
            "/sharing/shares/{$proposal->id}/approval",
            [
                'previewId' => $preview->id,
                'previewChecksum' => $preview->checksum,
            ],
        )
            ->assertRedirect("/sharing/shares/{$proposal->id}");

        $this->assertSame(ShareStatus::Pending, Share::query()->findOrFail($proposal->id)->status);
    }

    public function test_the_list_filters_by_state_and_pages_on(): void
    {
        $share = $this->createShare();

        for ($index = 0; $index < 26; $index++) {
            Share::create(
                $this->plan->shareIdentity(),
                CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS),
                new ShareProposal(ActorIdentity::ofClass(Agent::class, $this->owner->id)),
            );
        }

        $this->actingAs($this->owner)->get('/sharing?state=pending')->assertOk()->assertInertia(fn (
            AssertableInertia $page,
        ) => $page
            ->has('page.data.root.children.1.children.0.children.1.children.0.rows', 1)
            ->where('page.data.root.children.1.children.0.children.1.children.0.rows.0.key', $share->id));
        $first = $this->actingAs($this->owner)->get('/sharing?state=proposed')->assertOk();
        $first->assertInertia(
            fn (AssertableInertia $page) => $page
                ->has('page.data.root.children.1.children.0.children.1.children.0.rows', 25)
                ->where('page.data.root.children.1.children.0.children.1.children.1.action.appends', true)
                ->missing('page.data.root.children.0.children.1')
                ->whereType('page.data.root.children.1.children.0.children.1.children.1.action.query.after', 'string'),
        );
        $after = $first->viewData('page')['props']['page']['data']['root']['children'][1]['children'][0]['children'][1]['children'][1]['action']['query']['after'];
        $this->actingAs($this->owner)->get(
            "/sharing?state=proposed&after={$after}",
        )->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->has('page.data.root.children.1.children.0.children.1.children.0.rows', 1)
            ->missing('page.data.root.children.1.children.0.children.1.children.1'));
    }

    public function test_another_user_sees_no_share_and_changes_nothing(): void
    {
        $share = $this->createShare();
        $other = User::factory()->create();

        $this->assertFalse($this->actingAs($other)->get('/sharing')->isOk());
        $this->assertFalse($this->actingAs($other)->get("/sharing/shares/{$share->id}")->isOk());
        $this->assertFalse($this->actingAs($other)->postJson("/sharing/shares/{$share->id}/link")->isOk());
        $this->assertFalse(
            $this->actingAs($other)->deleteJson(
                "/sharing/shares/{$share->id}",
                [],
                ['Idempotency-Key' => '01JD8X0G9M3QZ6V4K2OTHER001'],
            )->isSuccessful(),
        );
        $this->assertSame(ShareStatus::Pending, Share::query()->findOrFail($share->id)->status);
    }

    private function createShare(): Share
    {
        $this->savePreview([$this->document->id]);
        $preview = SharePreview::query()->whereNull('consumed_at')->sole();
        $this->write(
            'post',
            $this->rootPath().'/shares',
            [
                'previewId' => $preview->id,
                'previewChecksum' => $preview->checksum,
                'minutes' => 60,
            ],
        )->assertStatus(303);

        return Share::query()->sole();
    }

    /**
     * @param  list<string>  $selected
     */
    private function savePreview(array $selected = []): void
    {
        $this->actingAs($this->owner)->post(
            $this->rootPath().'/previews',
            ['selected' => $selected],
        )->assertStatus(303);
    }

    /**
     * @param  array<string, mixed>  $body
     * @return TestResponse<Response>
     */
    private function write(string $method, string $path, array $body = []): TestResponse
    {
        return $this->actingAs($this->owner)->{$method}($path, $body, ['Idempotency-Key' => (string) Str::ulid()]);
    }

    private function rootPath(): string
    {
        return '/sharing/'.rawurlencode("plan {$this->plan->number}");
    }
}
