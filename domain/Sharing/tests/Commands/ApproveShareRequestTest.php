<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Support\ActorContext;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Models\Document;
use Domain\Sharing\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use Domain\Sharing\Commands\RequestShare\RequestShareCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Events\ShareCreated;
use Domain\Sharing\Events\ShareRequested;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Support\ProposalStatusResolver;
use Domain\Sharing\Support\SavedSharePreview;
use Domain\Sharing\Support\ShareProposalStatus;
use Domain\Sharing\Tests\Support\FakeShareGateway;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
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
final class ApproveShareRequestTest extends TestCase
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
        'number_groups',
        'session_tokens',
        'agent_sessions',
        'agents',
    ];

    private User $owner;

    private RecordIdentity $root;

    private ShareGatewayConfiguration $configuration;

    private TestStart $start;

    protected function setUp(): void
    {
        parent::setUp();

        $this->owner = $this->journal->owner()->ownerUser();

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
        $this->start = $this->journal->signedStart('Test agent');
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
        $this->journal->actAsUserId($this->owner->id);
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
            ShareStatus::Pending,
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
                    ShareStatus::Proposed,
                ],
                [
                    ShareCreated::class,
                    ShareStatus::Pending,
                ],
            ],
            $facts,
        );

        $this->journal->actAsAgentIds($this->start->agent->id, $this->start->session->id);

        $this->assertEquals(
            [new ShareProposalStatus($granted->number, ShareStatus::Pending)],
            $this->app->make(ProposalStatusResolver::class)->ownProposals(),
        );
    }

    private function request(string $key): ShareProposalStatus
    {
        $this->app->forgetScopedInstances();
        $this->journal->actAsAgentIds($this->start->agent->id, $this->start->session->id);
        $this->app->make(RequestKey::class)->set($key);

        return $this->app->make(CommandBus::class)->run(
            new RequestShareCommand($this->root->type, $this->root->id, $key),
        );
    }

    private function preview(): SavedSharePreview
    {
        return $this->app->make(CommandBus::class)->run(
            new SaveSharePreviewCommand($this->root->type, $this->root->id, [], $this->configuration->id),
        );
    }
}
