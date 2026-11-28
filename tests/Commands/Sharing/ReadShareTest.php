<?php

declare(strict_types=1);

namespace Tests\Commands\Sharing;

use App\Access\AccessSettings;
use App\Access\Exceptions\StackLockTimedOut;
use App\Models\Records\Link;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareAudit;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareMember;
use App\Sharing\Commands\ReadShare\ReadShareCommand;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareStatus;
use App\Sharing\Support\Gateways\GatewaySettings;
use App\Sharing\Support\ReadPermits;
use App\Sharing\Support\SharedPage;
use App\Sharing\Support\ShareGrant;
use App\Sharing\Support\ShareSelectedTarget;
use App\Sharing\Support\ShareToken;
use App\Support\OperationDeadline;
use App\Support\RecordIdentity;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Models\Document;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Sharing\SelectsShareTargets;
use Tests\Support\TestActors;
use Tests\Support\TestProjects;
use Tests\Support\TimeLimits\TimeLimit;
use Throwable;

/**
 * One public read: an active share reads its record, approved links and a page of comments, and audits it; an expired
 * share, lapsed grant or unapproved step is denied and audited, a nested read is refused, a withdrawn link is denied
 * while its sibling reads, and a read waits for a revoke.
 */
#[TestsCommand(ReadShareCommand::class)]
#[TimeLimit(seconds: 10, reason: 'It commits real bus reads and empties fourteen tables around each test.')]
final class ReadShareTest extends SharingTestCase
{
    use CommitsHookRows;
    use SelectsShareTargets;

    private const array TABLES = [
        'share_audits',
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
        'phases',
        'plans',
        'number_groups',
    ];

    private Document $document;

    private Plan $plan;

    private ShareGatewayConfiguration $configuration;

    protected function setUp(): void
    {
        parent::setUp();

        $this->journal->owner();

        $this->journal->asOwner(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.

        TEXT, TestProjects::local()->id));

        $this->document = Document::query()->where('number', 1)->sole();

        $this->plan = Plan::factory()->create(['title' => 'Version 6', 'type' => PlanType::Build]);

        Link::createForModels($this->plan, $this->document);

        $this->configuration = ShareGatewayConfiguration::create(
            new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []),
        );
    }

    public function test_an_active_share_reads_its_record_and_audits_the_read(): void
    {
        $token = $this->activeShare($this->document->shareIdentity(), CarbonImmutable::now()->addDay());

        $page = $this->read($token);

        $this->assertTrue($page->isAllowed);

        $this->assertSame(
            [
                'Design',
                '1',
                <<<'TEXT'
                # Goal
                Ship it.
    
                TEXT,
            ],
            [$page->title, $page->publicationVersion, $page->body],
        );

        $this->assertSame([ShareAuditType::ReadAllowed], $this->auditTypes());
    }

    public function test_a_head_read_carries_no_body(): void
    {
        $token = $this->activeShare($this->document->shareIdentity(), CarbonImmutable::now()->addDay());

        $this->assertSame('', $this->read($token, isHead: true)->body);
    }

    public function test_an_expired_share_and_a_lapsed_grant_are_denied_and_audited(): void
    {
        $expired = $this->activeShare($this->document->shareIdentity(), CarbonImmutable::now()->subMinute());
        $this->assertFalse($this->read($expired)->isAllowed);

        $current = $this->activeShare($this->document->shareIdentity(), CarbonImmutable::now()->addDay());
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(8));
        $denied = $this->read($current);

        $this->assertFalse($denied->isAllowed);
        $this->assertSame('', $denied->body);

        $this->assertSame([ShareAuditType::ReadDenied, ShareAuditType::ReadDenied], $this->auditTypes());
    }

    public function test_a_plan_reads_its_approved_linked_document_and_an_unapproved_step_is_denied(): void
    {
        $token = $this->activeShare($this->plan->shareIdentity(), CarbonImmutable::now()->addDay());
        $share = Share::query()->sole();
        $linkId = Link::query()->sole()->id;
        $step = "records/documents.document/{$this->document->id}";

        $this->assertFalse($this->read($token, $step)->isAllowed);

        $target = new ShareSelectedTarget($this->document->shareIdentity(), $linkId, '1');
        $selected = $this->selected($this->configuration, $this->plan->shareIdentity(), $target);
        ShareMember::createMany($share, $selected);
        $root = $this->read($token);
        $linked = $this->read($token, $step);

        $this->assertSame([$this->document->id], array_map(fn ($item) => $item->id, $root->linked));
        $this->assertTrue($linked->isAllowed);
        $this->assertSame('Design', $linked->title);
    }

    public function test_comments_page_through_a_signed_cursor(): void
    {
        $token = $this->activeShare($this->document->shareIdentity(), CarbonImmutable::now()->addDay());
        $this->insertComments(60);

        $first = $this->read($token);
        $second = $this->read($token, cursor: $first->nextCursor);

        $this->assertCount(50, $first->children);
        $this->assertNotNull($first->nextCursor);
        $this->assertCount(10, $second->children);
        $this->assertNull($second->nextCursor);
    }

    public function test_a_read_nested_in_another_transaction_is_refused_before_anything_is_read(): void
    {
        $token = $this->activeShare($this->document->shareIdentity(), CarbonImmutable::now()->addDay());

        $this->assertThrows(fn () => DB::transaction(fn () => $this->read($token)), Throwable::class);
        $this->assertSame([], $this->auditTypes());
    }

    public function test_a_linked_record_whose_disclosure_is_withdrawn_is_denied_while_its_sibling_still_reads(): void
    {
        $this->journal->asOwner(new CreateDocumentCommand('Notes', 'What we learned', <<<'TEXT'
        # Notes
        Keep it.

        TEXT, TestProjects::local()->id));

        $sibling = Document::query()->where('number', 2)->sole();
        Link::createForModels($this->plan, $sibling);
        $token = $this->activeShare($this->plan->shareIdentity(), CarbonImmutable::now()->addDay());
        $share = Share::query()->sole();

        $documents = [$this->document, $sibling];
        $documentIds = array_map(fn (Document $document) => $document->id, $documents);

        $links = Link::query()
            ->whereIn('target_id', $documentIds)
            ->orWhereIn('source_id', $documentIds)
            ->get();

        foreach ($documents as $document) {
            $link = $links->sole(
                fn (Link $link) => in_array($document->id, [$link->target_id, $link->source_id], true),
            );

            $target = new ShareSelectedTarget($document->shareIdentity(), $link->id, '1');
            $selected = $this->selected($this->configuration, $this->plan->shareIdentity(), $target);
            ShareMember::createMany($share, $selected);
        }

        $this->assertTrue($this->read($token, "records/documents.document/{$this->document->id}")->isAllowed);

        DB::table('document_revisions')->where('document_id', $this->document->id)->update(['closed_at' => null]);

        $withdrawn = $this->read($token, "records/documents.document/{$this->document->id}");
        $this->assertFalse($withdrawn->isAllowed);
        $this->assertSame('', $withdrawn->body);
        $this->assertSame([$sibling->id], array_map(fn ($item) => $item->id, $this->read($token)->linked));
        $this->assertTrue($this->read($token, "records/documents.document/{$sibling->id}")->isAllowed);
    }

    public function test_a_read_waits_for_a_revoke_holding_the_share_and_is_denied_once_it_committed(): void
    {
        $token = $this->activeShare($this->document->shareIdentity(), CarbonImmutable::now()->addDay());
        $shareId = Share::query()->sole()->id;
        config(['database.connections.revoker' => config('database.connections.'.config('database.default'))]);
        $revoker = DB::connection('revoker');
        $revoker->beginTransaction();

        try {
            $revoker->table('shares')->where('id', $shareId)->lockForUpdate()->sole();
            $this->app->instance(OperationDeadline::class, new OperationDeadline(500));

            $this->assertThrows(fn () => $this->read($token), StackLockTimedOut::class);

            $revoker->table('shares')->where('id', $shareId)->update(
                [
                    'status' => ShareStatus::Revoked->value,
                    'token_ciphertext' => null,
                    'terminal_at' => CarbonImmutable::now(),
                ],
            );

            $revoker->commit();
        } finally {
            if ($revoker->transactionLevel() > 0) {
                $revoker->rollBack();
            }

            DB::purge('revoker');
        }

        $this->app->forgetScopedInstances();
        $after = $this->read($token);

        $this->assertFalse($after->isAllowed);
        $this->assertSame('', $after->body);
    }

    private function activeShare(RecordIdentity $root, CarbonImmutable $expiresAt): string
    {
        $token = ShareToken::generate();

        $share = Share::create(
            $root,
            TestProjects::localOwner(),
            $expiresAt,
            new ShareGrant(
                $this->journal->ownerUser()->id,
                $this->configuration->id,
                $this->configuration->configuration_version,
                $token,
            ),
        );

        $share->status = ShareStatus::Active;
        $share->save();

        return $token->token;
    }

    private function read(
        string $token,
        string $path = '',
        string|null $cursor = null,
        bool $isHead = false,
    ): SharedPage {
        $permit = $this->app->make(ReadPermits::class)->issue($token);

        return $this->journal->throughEntry(new ReadShareCommand($permit->reference, $path, $cursor, $isHead));
    }

    /**
     * @return list<ShareAuditType>
     */
    private function auditTypes(): array
    {
        return array_values(
            ShareAudit::query()->orderBy('created_at')->orderBy('id')->get()->map(
                fn (ShareAudit $audit) => $audit->type,
            )->all(),
        );
    }

    private function insertComments(int $count): void
    {
        $now = CarbonImmutable::now();
        $rows = [];

        for ($position = 0; $position < $count; $position++) {
            $rows[] = [
                'id' => strtolower((string) Str::ulid()),
                'target_type' => Document::linkType(),
                'target_id' => $this->document->id,
                'author_type' => 'user',
                'author_id' => $this->journal->ownerUser()->id,
                'body' => "Comment {$position}",
                'submission_key' => "key-{$position}",
                'submission_hash' => str_repeat('a', 64),
                'created_at' => $now->addSeconds($position),
            ];
        }

        DB::table('comments')->insert($rows);
    }
}
