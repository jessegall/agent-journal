<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorIdentity;
use App\Actors\Values\TrustedEntryAuthority;
use App\Bus\Contracts\CommandBus;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Models\SharePreview;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Models\Document;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Symfony\Component\HttpFoundation\Response;
use Tests\Support\CommitsHookRows;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The owner's share management pages: confirm a saved preview into a share, find it in the list, reveal its address
 * only through the reveal action, update its members, retry a failed share and revoke it; every write needs its
 * Idempotency-Key, and anyone else sees none of it.
 */
#[TimeLimit(seconds: 10, reason: 'It commits a document and a plan through the bus, renders pages and empties nineteen tables around each test.')]
final class ShareManagementPagesTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['command_receipts', 'share_audits', 'share_members', 'share_gateway_operations', 'shares', 'share_previews', 'share_gateway_configurations', 'share_installations', 'users', 'links', 'comments', 'document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'phases', 'plans', 'number_groups'];

    private User $owner;

    private Plan $plan;

    private Document $document;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($this->owner->id), new TrustedEntryAuthority('test'));
        $this->app->make(CommandBus::class)->run(new CreateDocument('Design', 'What we build', "# Goal\nShip it.\n"));
        $this->document = Document::query()->where('number', 1)->sole();
        $this->plan = Plan::factory()->create(['title' => 'Version 6', 'type' => PlanType::Build]);
        $this->plan->linkTo($this->document);
        $this->app->make(CurrentActorSetter::class)->clear();
        $configuration = ShareGatewayConfiguration::configure(FakeShareGateway::settings());
        $configuration->is_default = true;
        $configuration->save();
    }

    public function test_the_owner_confirms_a_preview_finds_the_share_and_reveals_its_address_only_on_request(): void
    {
        $share = $this->createShare();

        $list = $this->actingAs($this->owner)->get('/sharing')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('sharing/SharesWindow')
            ->where('page.data.rows.0.id', $share->id)
            ->where('page.data.rows.0.state', 'pending')
            ->where('page.data.nextAfter', null));
        $this->assertStringNotContainsString(FakeShareGateway::PUBLIC_ORIGIN, (string) $list->getContent());

        $this->activate($share);
        $detail = $this->actingAs($this->owner)->get("/sharing/shares/{$share->id}")->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->component('sharing/ShareWindow')
            ->where('page.data.members.0.targetId', $this->document->id)
            ->where('page.data.mayReveal', true));
        $this->assertStringNotContainsString(FakeShareGateway::PUBLIC_ORIGIN, (string) $detail->getContent());

        $this->actingAs($this->owner)->postJson("/sharing/shares/{$share->id}/link")
            ->assertOk()
            ->assertJsonPath('url', FakeShareGateway::PUBLIC_ORIGIN.'/s/'.Share::query()->findOrFail($share->id)->token_ciphertext);
    }

    public function test_a_write_without_an_idempotency_key_is_refused(): void
    {
        $this->savePreview();
        $preview = SharePreview::query()->sole();

        $this->actingAs($this->owner)
            ->postJson($this->rootPath().'/shares', ['previewId' => $preview->id, 'previewChecksum' => $preview->checksum])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('idempotency_key');
        $this->assertSame(0, Share::query()->count());
    }

    public function test_the_owner_updates_the_members_retries_a_failed_share_and_revokes_it(): void
    {
        $share = $this->createShare();
        $this->savePreview([]);
        $preview = SharePreview::query()->whereNull('consumed_at')->sole();

        $this->write('post', "/sharing/shares/{$share->id}/scope", ['previewId' => $preview->id, 'previewChecksum' => $preview->checksum])->assertStatus(303);
        $this->assertSame(Share::FIRST_SCOPE_VERSION + 1, Share::query()->findOrFail($share->id)->scope_version);

        $failed = Share::query()->findOrFail($share->id);
        $failed->state = ShareState::Failed;
        $failed->save();
        $this->write('post', "/sharing/shares/{$share->id}/retry")->assertStatus(303);
        $this->assertSame(2, ShareGatewayOperation::query()->where('type', GatewayOperationType::Open->value)->count());

        $this->write('delete', "/sharing/shares/{$share->id}")->assertStatus(303);
        $this->assertSame(ShareState::Revoked, Share::query()->findOrFail($share->id)->state);
        $this->actingAs($this->owner)->postJson("/sharing/shares/{$share->id}/link")->assertNotFound();
    }

    public function test_the_owner_approves_a_proposal_from_a_saved_preview(): void
    {
        $proposal = Share::propose($this->plan->shareIdentity(), new ActorIdentity(ActorType::Agent, $this->owner->id), CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS));
        $this->savePreview();

        $this->actingAs($this->owner)->get($this->rootPath())->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->where('page.data.openProposals.0.id', $proposal->id));
        $preview = SharePreview::query()->sole();
        $this->write('post', "/sharing/shares/{$proposal->id}/approval", ['previewId' => $preview->id, 'previewChecksum' => $preview->checksum])
            ->assertRedirect("/sharing/shares/{$proposal->id}");

        $this->assertSame(ShareState::Pending, Share::query()->findOrFail($proposal->id)->state);
    }

    public function test_the_list_filters_by_state_and_pages_on(): void
    {
        $share = $this->createShare();

        for ($index = 0; $index < 26; $index++) {
            Share::propose($this->plan->shareIdentity(), new ActorIdentity(ActorType::Agent, $this->owner->id), CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS));
        }

        $this->actingAs($this->owner)->get('/sharing?state=pending')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->has('page.data.rows', 1)
            ->where('page.data.rows.0.id', $share->id));
        $first = $this->actingAs($this->owner)->get('/sharing?state=proposed')->assertOk();
        $first->assertInertia(fn (AssertableInertia $page) => $page->has('page.data.rows', 25)->whereType('page.data.nextAfter', 'string'));
        $after = $first->viewData('page')['props']['page']['data']['nextAfter'];
        $this->actingAs($this->owner)->get("/sharing?state=proposed&after={$after}")->assertOk()->assertInertia(fn (AssertableInertia $page) => $page
            ->has('page.data.rows', 1)
            ->where('page.data.nextAfter', null));
    }

    public function test_another_user_sees_no_share_and_changes_nothing(): void
    {
        $share = $this->createShare();
        $other = User::factory()->create();

        $this->assertFalse($this->actingAs($other)->get('/sharing')->isOk());
        $this->assertFalse($this->actingAs($other)->get("/sharing/shares/{$share->id}")->isOk());
        $this->assertFalse($this->actingAs($other)->postJson("/sharing/shares/{$share->id}/link")->isOk());
        $this->assertFalse($this->actingAs($other)->deleteJson("/sharing/shares/{$share->id}", [], ['Idempotency-Key' => '01JD8X0G9M3QZ6V4K2OTHER001'])->isSuccessful());
        $this->assertSame(ShareState::Pending, Share::query()->findOrFail($share->id)->state);
    }

    private function createShare(): Share
    {
        $this->savePreview([$this->document->id]);
        $preview = SharePreview::query()->whereNull('consumed_at')->sole();
        $this->write('post', $this->rootPath().'/shares', ['previewId' => $preview->id, 'previewChecksum' => $preview->checksum, 'minutes' => 60])->assertStatus(303);

        return Share::query()->sole();
    }

    /**
     * @param  list<string>  $selected
     */
    private function savePreview(array $selected = []): void
    {
        $this->actingAs($this->owner)->post($this->rootPath().'/previews', ['selected' => $selected])->assertStatus(303);
    }

    /**
     * @param  array<string, mixed>  $body
     * @return TestResponse<Response>
     */
    private function write(string $method, string $path, array $body = []): TestResponse
    {
        return $this->actingAs($this->owner)->{$method}($path, $body, ['Idempotency-Key' => (string) Str::ulid()]);
    }

    private function activate(Share $share): void
    {
        $share->state = ShareState::Active;
        $share->save();
    }

    private function rootPath(): string
    {
        return '/sharing/'.rawurlencode("plan {$this->plan->number}");
    }
}
