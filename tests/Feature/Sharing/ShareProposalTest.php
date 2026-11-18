<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Enums\ActorType;
use App\Actors\Exceptions\UserActorRequired;
use App\Actors\Support\ActorContext;
use App\Bus\Contracts\CommandBus;
use App\Bus\Support\RequestKey;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\ApproveShareRequest;
use App\Sharing\Commands\CreateShare;
use App\Sharing\Commands\RequestShare;
use App\Sharing\Commands\SaveSharePreview;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Exceptions\ShareQuotaReached;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareGatewayOperation;
use App\Sharing\Support\ProposalStatusReader;
use App\Sharing\Support\SavedSharePreview;
use App\Sharing\Support\ShareDuration;
use App\Sharing\Support\ShareProposalStatus;
use Carbon\CarbonImmutable;
use Domain\Access\Models\User;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Models\Document;
use Tests\Fixtures\Agents\TestLaunch;
use Tests\Support\CommitsHookRows;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * An agent proposes sharing a document it may read and learns only the proposal's number and state; it may not create
 * a share itself. The owner approves the proposal from a fresh preview into a pending grant. Open proposals are
 * capped at 100, and an expired one frees its slot at once.
 */
#[TimeLimit(seconds: 10, reason: 'It commits a document and a hundred proposals, and empties the sharing and agent tables around each test.')]
final class ShareProposalTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

    private const array TABLES = ['command_receipts', 'share_audits', 'share_members', 'share_gateway_operations', 'shares', 'share_previews', 'share_gateway_configurations', 'share_installations', 'users', 'links', 'comments', 'document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'number_groups', 'launch_credentials', 'agent_sessions', 'agents'];

    private User $owner;

    private RecordIdentity $root;

    private ShareGatewayConfiguration $configuration;

    private TestLaunch $launch;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = User::factory()->create();
        $this->app->instance(AccessSettings::class, new AccessSettings($this->owner->id));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser($this->owner->id));
        $this->app->make(CommandBus::class)->run(new CreateDocument('Design', 'What we build', "# Goal\nShip it.\n"));
        $this->app->make(CurrentActorSetter::class)->clear();
        $this->root = Document::query()->where('number', 1)->sole()->shareIdentity();
        $this->configuration = ShareGatewayConfiguration::configure(FakeShareGateway::settings());
        $this->launch = TestLaunch::start();
    }

    public function test_an_agent_request_creates_a_proposal_and_returns_its_number_and_state_only(): void
    {
        $status = $this->request('01JD8X0G9M3QZ6V4K2PROPOSE1');
        $proposal = Share::query()->sole();

        $this->assertEquals(new ShareProposalStatus($proposal->number, ShareState::Proposed), $status);
        $this->assertSame(['number', 'state'], array_keys(get_object_vars($status)));
        $this->assertNull($proposal->token_digest);
        $this->assertNull($proposal->owner_user_id);
        $this->assertSame($this->launch->agent->id, $proposal->requesting_agent_id);
        $this->assertSame($this->launch->session->id, $proposal->requesting_session_id);
        $this->assertSame(0, ShareGatewayOperation::query()->count());
        $audit = ShareAudit::query()->readAll('one audit')->sole();
        $this->assertSame([ShareAuditType::Created, ActorType::Agent], [$audit->type, $audit->actor_type]);
    }

    public function test_a_repeated_request_with_the_same_key_makes_one_proposal(): void
    {
        $first = $this->request('01JD8X0G9M3QZ6V4K2PROPOSE1');
        $repeat = $this->request('01JD8X0G9M3QZ6V4K2PROPOSE1');

        $this->assertEquals($first, $repeat);
        $this->assertSame(1, Share::query()->count());
    }

    public function test_create_share_from_an_agent_is_refused_before_its_handler(): void
    {
        $this->startRequestAs($this->launch->agent->id, $this->launch->session->id);
        $this->app->make(RequestKey::class)->set('01JD8X0G9M3QZ6V4K2PROPOSE2');

        $this->assertThrows(fn () => $this->app->make(CommandBus::class)->run(new CreateShare(TestIds::of(1), str_repeat('0', 64), ShareDuration::STANDARD_MINUTES, '01JD8X0G9M3QZ6V4K2PROPOSE2')), UserActorRequired::class);
        $this->assertSame(0, Share::query()->count());
    }

    public function test_the_owner_approves_a_proposal_into_a_pending_grant(): void
    {
        $this->request('01JD8X0G9M3QZ6V4K2PROPOSE1');
        $proposal = Share::query()->sole();

        $this->app->forgetScopedInstances();
        $this->startUserRequestAs($this->owner->id);
        $saved = $this->preview();
        $this->app->make(RequestKey::class)->set('01JD8X0G9M3QZ6V4K2APPROVE1');
        $summary = $this->app->make(CommandBus::class)->run(new ApproveShareRequest($proposal->id, $saved->previewId, $saved->checksum, 60, '01JD8X0G9M3QZ6V4K2APPROVE1'));
        $granted = Share::query()->findOrFail($proposal->id);

        $this->assertSame([$proposal->id, ShareState::Pending], [$summary->shareId, $summary->state]);
        $this->assertSame($this->owner->id, $granted->owner_user_id);
        $this->assertSame(Share::FIRST_SCOPE_VERSION, $granted->scope_version);
        $this->assertNotNull($granted->token_digest);
        $this->assertEqualsWithDelta(CarbonImmutable::now()->addHour()->getTimestamp(), $granted->expires_at->getTimestamp(), 5);
        $this->assertSame(GatewayOperationType::Open, ShareGatewayOperation::query()->readAll('one operation')->sole()->type);
        $this->assertTrue(ShareAudit::query()->readAll('two audits')->get()->contains(fn (ShareAudit $audit) => $audit->type === ShareAuditType::Approved));

        $this->startRequestAs($this->launch->agent->id, $this->launch->session->id);
        $this->assertEquals([new ShareProposalStatus($granted->number, ShareState::Pending)], $this->app->make(ProposalStatusReader::class)->ownProposals());
    }

    public function test_an_agent_never_sees_another_agents_proposal(): void
    {
        $this->request('01JD8X0G9M3QZ6V4K2PROPOSE1');
        $other = TestLaunch::start();

        $this->startRequestAs($other->agent->id, $other->session->id);

        $this->assertSame([], $this->app->make(ProposalStatusReader::class)->ownProposals());
    }

    public function test_the_hundred_and_first_proposal_is_refused_and_an_expired_one_frees_a_slot(): void
    {
        for ($index = 0; $index < Share::MOST_PROPOSED; $index++) {
            Share::propose($this->root, $this->launch->agent->id, $this->launch->session->id, CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS));
        }

        $this->assertThrows(fn () => $this->request('01JD8X0G9M3QZ6V4K2PROPOSE1'), ShareQuotaReached::class);

        $oldest = Share::query()->orderBy('id')->firstOrFail();
        $oldest->expires_at = CarbonImmutable::now()->subMinute();
        $oldest->save();

        $this->assertSame(ShareState::Proposed, $this->request('01JD8X0G9M3QZ6V4K2PROPOSE3')->state);
    }

    private function request(string $key): ShareProposalStatus
    {
        $this->app->forgetScopedInstances();
        $this->startRequestAs($this->launch->agent->id, $this->launch->session->id);
        $this->app->make(RequestKey::class)->set($key);

        return $this->app->make(CommandBus::class)->run(new RequestShare($this->root->type, $this->root->id, $key));
    }

    private function preview(): SavedSharePreview
    {
        return $this->app->make(CommandBus::class)->run(new SaveSharePreview($this->root->type, $this->root->id, [], $this->configuration->id));
    }
}
