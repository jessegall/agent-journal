<?php

declare(strict_types=1);

namespace Tests\Commands\Sharing;

use App\Bus\Contracts\CommandBus;
use App\Bus\RequestKey;
use App\Events\Sharing\ShareCreated;
use App\Events\Sharing\ShareRequested;
use App\Models\Access\User;
use App\Models\Agents\Agent;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayOperation;
use App\Sharing\Commands\ApproveShareRequest\ApproveShareRequestCommand;
use App\Sharing\Commands\RequestShare\RequestShareCommand;
use App\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use App\Sharing\Enums\GatewayOperationType;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareStatus;
use App\Sharing\Support\ProposalStatusResolver;
use App\Sharing\Support\SavedSharePreview;
use App\Sharing\Support\ShareProposalStatus;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Models\Document;
use Illuminate\Support\Facades\Event;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestProjects;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * An agent proposes sharing a document it may read and learns only the proposal's number and state; it may not create
 * a share itself. The owner approves the proposal from a fresh preview into a pending grant. Open proposals are
 * capped at 100, and an expired one frees its slot at once. The requester is kept as an actor, never by session.
 */
#[TestsCommand(ApproveShareRequestCommand::class)]
#[TimeLimit(
    seconds: 10,
    reason: 'It commits a document and a hundred proposals, and empties the sharing and agent tables around each test.',
)]
final class ApproveShareRequestTest extends SharingTestCase
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

        $this->journal->asOwner(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT, TestProjects::local()->id));

        $this->root = Document::query()->where('number', 1)->sole()->shareIdentity();
        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->start = $this->journal->signedStart('Test agent');
    }

    public function test_the_owner_approves_a_proposal_into_a_pending_grant(): void
    {
        $facts = [];

        Event::listen([ShareRequested::class, ShareCreated::class], function (object $fact) use (&$facts): void {
            $facts[] = [
                $fact::class,
                $fact->share->status,
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

        $this->assertSame([$proposal->id, ShareStatus::Pending], [$summary->shareId, $summary->status]);

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
            ShareGatewayOperation::query()->sole()->type,
        );

        $this->assertTrue(
            ShareAudit::query()->get()->contains(
                fn (ShareAudit $audit) => $audit->type === ShareAuditType::Approved,
            ),
        );

        $this->assertSame(
            [[ShareRequested::class, ShareStatus::Proposed], [ShareCreated::class, ShareStatus::Pending]],
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
