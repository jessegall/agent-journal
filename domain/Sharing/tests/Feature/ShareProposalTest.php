<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Feature;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandAdmissionRefused;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\Access\AccessSettings;
use App\Support\ActorContext;
use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Models\Document;
use Domain\Sharing\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use Domain\Sharing\Commands\CreateShare\CreateShareCommand;
use Domain\Sharing\Commands\RequestShare\RequestShareCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Enums\ShareState;
use Domain\Sharing\Events\ShareCreated;
use Domain\Sharing\Events\ShareRequested;
use Domain\Sharing\Exceptions\ShareQuotaReached;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Support\ProposalStatusResolver;
use Domain\Sharing\Support\SavedSharePreview;
use Domain\Sharing\Support\ShareDuration;
use Domain\Sharing\Support\ShareProposal;
use Domain\Sharing\Support\ShareProposalStatus;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * An agent proposes sharing a document it may read and learns only the proposal's number and state; it may not create
 * a share itself. The owner approves the proposal from a fresh preview into a pending grant. Open proposals are
 * capped at 100, and an expired one frees its slot at once. The requester is kept as an actor, never by session.
 */
#[TimeLimit(
    seconds: 10,
    reason: 'It commits a document and a hundred proposals, and empties the sharing and agent tables around each test.',
)]
final class ShareProposalTest extends TestCase
{
    use CommitsHookRows;
    use StartsAgentRequests;

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
        'number_groups',
        'session_tokens',
        'agent_sessions',
        'agents',
    ];

    private const int BULK_NUMBERS = 1_000_000;

    private User $owner;

    private RecordIdentity $root;

    private ShareGatewayConfiguration $configuration;

    private TestStart $start;

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
        $this->root = Document::query()->where('number', 1)->sole()->shareIdentity();
        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->start = TestStart::start();
    }

    public function test_an_agent_request_creates_a_proposal_and_returns_its_number_and_state_only(): void
    {
        $status = $this->request('01JD8X0G9M3QZ6V4K2PROPOSE1');
        $proposal = Share::query()->sole();

        $this->assertEquals(new ShareProposalStatus($proposal->number, ShareState::Proposed), $status);
        $this->assertSame([
            'number',
            'state',
        ], array_keys(get_object_vars($status)));
        $this->assertNull($proposal->token_digest);
        $this->assertNull($proposal->owner_user_id);
        $this->assertSame(
            [
                Agent::storedType(),
                $this->start->agent->id,
            ],
            [
                $proposal->requester_type,
                $proposal->requester_id,
            ],
        );
        $this->assertSame(0, ShareGatewayOperation::query()->count());
        $audit = ShareAudit::query()->readAll('one audit')->sole();
        $this->assertSame([
            ShareAuditType::Created,
            Agent::storedType(),
        ], [
            $audit->type,
            $audit->actor_type,
        ]);
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
        $this->startRequestAs($this->start->agent->id, $this->start->session->id);
        $this->app->make(RequestKey::class)->set('01JD8X0G9M3QZ6V4K2PROPOSE2');

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(
                new CreateShareCommand(
                    TestIds::of(1),
                    str_repeat('0', 64),
                    ShareDuration::STANDARD_MINUTES,
                    '01JD8X0G9M3QZ6V4K2PROPOSE2',
                ),
            ),
            CommandAdmissionRefused::class,
        );
        $this->assertSame(0, Share::query()->count());
    }

    public function test_the_owner_approves_a_proposal_into_a_pending_grant(): void
    {
        $facts = [];
        Event::listen([
            ShareRequested::class,
            ShareCreated::class,
        ], function (object $fact) use (&$facts): void {
            $facts[] = [
                $fact::class,
                $fact->share->state,
            ];
        });
        $this->request('01JD8X0G9M3QZ6V4K2PROPOSE1');
        $proposal = Share::query()->sole();

        $this->app->forgetScopedInstances();
        $this->startUserRequestAs($this->owner->id);
        $saved = $this->preview();
        $this->app->make(RequestKey::class)->set('01JD8X0G9M3QZ6V4K2APPROVE1');
        $summary = $this->app->make(CommandBus::class)->run(
            new ApproveShareRequestCommand(
                $proposal->id,
                $saved->previewId,
                $saved->checksum,
                60,
                '01JD8X0G9M3QZ6V4K2APPROVE1',
            ),
        );
        $granted = Share::query()->findOrFail($proposal->id);

        $this->assertSame([
            $proposal->id,
            ShareState::Pending,
        ], [
            $summary->shareId,
            $summary->state,
        ]);
        $this->assertSame($this->owner->id, $granted->owner_user_id);
        $this->assertSame(Share::FIRST_SCOPE_VERSION, $granted->scope_version);
        $this->assertNotNull($granted->token_digest);
        $this->assertEqualsWithDelta(
            CarbonImmutable::now()->addHour()->getTimestamp(),
            $granted->expires_at->getTimestamp(),
            5,
        );
        $this->assertSame(
            GatewayOperationType::Open,
            ShareGatewayOperation::query()->readAll('one operation')->sole()->type,
        );
        $this->assertTrue(
            ShareAudit::query()->readAll('two audits')->get()->contains(
                fn (ShareAudit $audit) => $audit->type === ShareAuditType::Approved,
            ),
        );

        $this->assertSame(
            [
                [
                    ShareRequested::class,
                    ShareState::Proposed,
                ],
                [
                    ShareCreated::class,
                    ShareState::Pending,
                ],
            ],
            $facts,
        );

        $this->startRequestAs($this->start->agent->id, $this->start->session->id);
        $this->assertEquals(
            [new ShareProposalStatus($granted->number, ShareState::Pending)],
            $this->app->make(ProposalStatusResolver::class)->ownProposals(),
        );
    }

    public function test_an_agent_never_sees_another_agents_proposal(): void
    {
        $this->request('01JD8X0G9M3QZ6V4K2PROPOSE1');
        $other = TestStart::start();

        $this->startRequestAs($other->agent->id, $other->session->id);

        $this->assertSame([], $this->app->make(ProposalStatusResolver::class)->ownProposals());
    }

    public function test_the_hundred_and_first_proposal_is_refused_and_an_expired_one_frees_a_slot(): void
    {
        $this->proposeMany(Share::PROPOSED_LIMIT);

        $this->assertThrows(fn () => $this->request('01JD8X0G9M3QZ6V4K2PROPOSE1'), ShareQuotaReached::class);

        $oldest = Share::query()->orderBy('id')->firstOrFail();
        $oldest->expires_at = CarbonImmutable::now()->subMinute();
        $oldest->save();

        $this->assertSame(ShareState::Proposed, $this->request('01JD8X0G9M3QZ6V4K2PROPOSE3')->state);
    }

    private function request(string $key): ShareProposalStatus
    {
        $this->app->forgetScopedInstances();
        $this->startRequestAs($this->start->agent->id, $this->start->session->id);
        $this->app->make(RequestKey::class)->set($key);

        return $this->app->make(CommandBus::class)->run(new RequestShareCommand($this->root->type, $this->root->id, $key));
    }

    private function preview(): SavedSharePreview
    {
        return $this->app->make(CommandBus::class)->run(
            new SaveSharePreviewCommand($this->root->type, $this->root->id, [], $this->configuration->id),
        );
    }

    /**
     * Open proposals of the root in one insert after the first, numbered far above the group's counter so later
     * numbered proposals never collide with them, so the limit is reached quickly.
     */
    private function proposeMany(int $count): void
    {
        $first = Share::create(
            $this->root,
            CarbonImmutable::now()->addDays(Share::PROPOSAL_DAYS),
            new ShareProposal(ActorIdentity::ofClass(Agent::class, $this->start->agent->id)),
        );
        $now = CarbonImmutable::now();
        $rows = [];

        for ($index = 1; $index < $count; $index++) {
            $rows[] = [
                'id' => Str::lower((string) Str::ulid()),
                'number_group_id' => $first->number_group_id,
                'number' => self::BULK_NUMBERS + $index,
                'state' => ShareState::Proposed->value,
                'root_type' => $this->root->type,
                'root_id' => $this->root->id,
                'requester_type' => Agent::storedType(),
                'requester_id' => $this->start->agent->id,
                'scope_version' => 0,
                'expires_at' => $now->addDays(Share::PROPOSAL_DAYS),
                'created_at' => $now,
                'updated_at' => $now,
            ];
        }

        $this->app->make(ConnectionInterface::class)->table('shares')->insert($rows);
    }
}
