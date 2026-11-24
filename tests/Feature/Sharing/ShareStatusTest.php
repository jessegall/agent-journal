<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sharing\ShareStatusResolver;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareMember;
use App\Support\ActorContext;
use App\Support\GatewaySettings;
use App\Support\ShareGrant;
use App\Support\ShareSelectedTarget;
use App\Support\ShareToken;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
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
#[TimeLimit(
    seconds: 5,
    reason: 'It commits a document through the bus and renders a page, and empties twelve tables around each test.',
)]
final class ShareStatusTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [
        'users',
        'share_members',
        'shares',
        'share_gateway_configurations',
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

    private Document $document;

    private ShareGatewayConfiguration $configuration;

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
        $this->app->make(CurrentActorSetter::class)->clear();
        $this->document = Document::query()->where('number', 1)->sole();
        $this->configuration = ShareGatewayConfiguration::create(
            new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []),
        );
    }

    public function test_a_root_or_approved_member_of_a_live_share_is_public_and_an_expired_one_is_not(): void
    {
        $status = $this->app->make(ShareStatusResolver::class);
        $root = TestActors::record('plans.plan', 5);

        $this->assertFalse($status->isPubliclyShared($this->document->shareIdentity()));

        $expired = Share::create(
            $this->document->shareIdentity(),
            CarbonImmutable::now()->subMinute(),
            new ShareGrant(
                $this->owner->id,
                $this->configuration->id,
                $this->configuration->configuration_version,
                ShareToken::generate(),
            ),
        );

        $this->assertFalse($status->isPubliclyShared($expired->root));

        $share = Share::create(
            $root,
            CarbonImmutable::now()->addDays(7),
            new ShareGrant(
                $this->owner->id,
                $this->configuration->id,
                $this->configuration->configuration_version,
                ShareToken::generate(),
            ),
        );
        ShareMember::create(
            $share,
            $root,
            new ShareSelectedTarget($this->document->shareIdentity(), TestIds::of(6), '1'),
        );

        $this->assertTrue($status->isPubliclyShared($root));
        $this->assertTrue($status->isPubliclyShared($this->document->shareIdentity()));
    }

    public function test_the_document_page_reminds_the_owner_only_while_it_is_shared(): void
    {
        $this->actingAs($this->owner)->get('/documents/docs/1')->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.2.children.0.children.1.key', 'comments'),
        );

        Share::create(
            $this->document->shareIdentity(),
            CarbonImmutable::now()->addDays(7),
            new ShareGrant(
                $this->owner->id,
                $this->configuration->id,
                $this->configuration->configuration_version,
                ShareToken::generate(),
            ),
        );

        $this->actingAs($this->owner)->get('/documents/docs/1')->assertOk()->assertInertia(
            fn (AssertableInertia $page) => $page
                ->where('page.data.root.children.2.children.0.children.0.key', 'public'),
        );
    }
}
