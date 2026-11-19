<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Values\OwnerAuthority;
use App\Bus\Contracts\CommandBus;
use App\Sharing\Contracts\ShareStatusResolver;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareMember;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\ShareSelectedTarget;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Models\Document;
use Inertia\Testing\AssertableInertia;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Whether a record is public now: the root of a live, unexpired share or an approved member of its current scope; the
 * document page reminds the owner that a comment there will be public only then.
 */
#[TimeLimit(seconds: 5, reason: 'It commits a document through the bus and renders a page, and empties twelve tables around each test.')]
final class ShareStatusTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['users', 'share_members', 'shares', 'share_gateway_configurations', 'links', 'comments', 'document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'number_groups'];

    private User $owner;

    private Document $document;

    private ShareGatewayConfiguration $configuration;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($this->owner->id), new OwnerAuthority('test'));
        $this->app->make(CommandBus::class)->run(new CreateDocument('Design', 'What we build', "# Goal\nShip it.\n"));
        $this->app->make(CurrentActorSetter::class)->clear();
        $this->document = Document::query()->where('number', 1)->sole();
        $this->configuration = ShareGatewayConfiguration::configure(new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []));
    }

    public function test_a_root_or_approved_member_of_a_live_share_is_public_and_an_expired_one_is_not(): void
    {
        $status = $this->app->make(ShareStatusResolver::class);
        $root = TestActors::record('plans.plan', 5);

        $this->assertFalse($status->isPubliclyShared($this->document->shareIdentity()));

        $expired = Share::grant($this->document->shareIdentity(), $this->owner->id, $this->configuration, ShareToken::generate(), CarbonImmutable::now()->subMinute());

        $this->assertFalse($status->isPubliclyShared($expired->root()));

        $share = Share::grant($root, $this->owner->id, $this->configuration, ShareToken::generate(), CarbonImmutable::now()->addDays(7));
        ShareMember::approve($share, $root, new ShareSelectedTarget($this->document->shareIdentity(), TestIds::of(6), '1'));

        $this->assertTrue($status->isPubliclyShared($root));
        $this->assertTrue($status->isPubliclyShared($this->document->shareIdentity()));
    }

    public function test_the_document_page_reminds_the_owner_only_while_it_is_shared(): void
    {
        $this->actingAs($this->owner)->get('/documents/docs/1')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page->where('page.data.record.publiclyShared', false));

        Share::grant($this->document->shareIdentity(), $this->owner->id, $this->configuration, ShareToken::generate(), CarbonImmutable::now()->addDays(7));

        $this->actingAs($this->owner)->get('/documents/docs/1')->assertOk()->assertInertia(fn (AssertableInertia $page) => $page->where('page.data.record.publiclyShared', true));
    }
}
