<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Actors\Contracts\CurrentActorSetter;
use App\Actors\Support\ActorContext;
use App\Actors\Support\ActorStore;
use App\Bus\Contracts\CommandBus;
use App\Records\Support\RecordIdentity;
use App\Sharing\Commands\ReadShare;
use App\Sharing\Enums\ShareAuditType;
use App\Sharing\Enums\ShareState;
use App\Sharing\Models\Share;
use App\Sharing\Models\ShareAudit;
use App\Sharing\Models\ShareGatewayConfiguration;
use App\Sharing\Models\ShareMember;
use App\Sharing\Support\GatewaySettings;
use App\Sharing\Support\ReadPermits;
use App\Sharing\Support\SharedPage;
use App\Sharing\Support\ShareSelectedTarget;
use App\Sharing\Support\ShareToken;
use Carbon\CarbonImmutable;
use Domain\Access\Support\AccessSettings;
use Domain\Documents\Commands\CreateDocument;
use Domain\Documents\Models\Document;
use Domain\Plans\Enums\PlanType;
use Domain\Plans\Models\Plan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;
use Throwable;

/**
 * One public read: an active share reads its record, its approved linked records and a page of comments, and audits
 * the read; an expired share, a lapsed grant or an unapproved step is denied and audited without content; a read
 * nested in another transaction is refused before anything is read.
 */
#[TimeLimit(seconds: 5, reason: 'It commits real bus reads and empties fourteen tables around each test.')]
final class ReadShareTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = ['share_audits', 'share_members', 'shares', 'share_gateway_configurations', 'links', 'comments', 'document_closes', 'document_drafts', 'reports', 'document_revisions', 'documents', 'phases', 'plans', 'number_groups'];

    private Document $document;

    private Plan $plan;

    private ShareGatewayConfiguration $configuration;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(9)));
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::forUser(TestIds::of(9)));
        $this->app->make(CommandBus::class)->run(new CreateDocument('Design', 'What we build', "# Goal\nShip it.\n"));
        $this->app->make(CurrentActorSetter::class)->clear();
        $this->document = Document::query()->where('number', 1)->sole();
        $this->plan = Plan::query()->create(['title' => 'Version 6', 'type' => PlanType::Build]);
        $this->plan->linkTo($this->document);
        $this->configuration = ShareGatewayConfiguration::configure(new GatewaySettings('press', '1.0.0', 'example.test', 'https://share.example.test', 8100, []));
    }

    public function test_an_active_share_reads_its_record_and_audits_the_read(): void
    {
        $token = $this->activeShare($this->document->shareIdentity(), CarbonImmutable::now()->addDay());

        $page = $this->read($token);

        $this->assertTrue($page->allowed);
        $this->assertSame(['Design', '1', "# Goal\nShip it.\n"], [$page->title, $page->publicationVersion, $page->body]);
        $this->assertSame([ShareAuditType::ReadAllowed], $this->auditTypes());
    }

    public function test_a_head_read_carries_no_body(): void
    {
        $token = $this->activeShare($this->document->shareIdentity(), CarbonImmutable::now()->addDay());

        $this->assertSame('', $this->read($token, head: true)->body);
    }

    public function test_an_expired_share_and_a_lapsed_grant_are_denied_and_audited(): void
    {
        $expired = $this->activeShare($this->document->shareIdentity(), CarbonImmutable::now()->subMinute());
        $this->assertFalse($this->read($expired)->allowed);

        $current = $this->activeShare($this->document->shareIdentity(), CarbonImmutable::now()->addDay());
        $this->app->instance(AccessSettings::class, new AccessSettings(TestIds::of(8)));
        $denied = $this->read($current);

        $this->assertFalse($denied->allowed);
        $this->assertSame('', $denied->body);
        $this->assertSame([ShareAuditType::ReadDenied, ShareAuditType::ReadDenied], $this->auditTypes());
    }

    public function test_a_plan_reads_its_approved_linked_document_and_an_unapproved_step_is_denied(): void
    {
        $token = $this->activeShare($this->plan->shareIdentity(), CarbonImmutable::now()->addDay());
        $share = Share::query()->sole();
        $linkId = (string) DB::table('links')->value('id');
        $step = "records/documents.document/{$this->document->id}";

        $this->assertFalse($this->read($token, $step)->allowed);

        ShareMember::approve($share, $this->plan->shareIdentity(), new ShareSelectedTarget($this->document->shareIdentity(), $linkId, '1'));
        $root = $this->read($token);
        $linked = $this->read($token, $step);

        $this->assertSame([$this->document->id], array_map(fn ($item) => $item->id, $root->linked));
        $this->assertTrue($linked->allowed);
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

    private function activeShare(RecordIdentity $root, CarbonImmutable $expiresAt): string
    {
        $token = ShareToken::generate();
        $share = Share::grant($root, TestIds::of(9), $this->configuration, $token, $expiresAt);
        $share->state = ShareState::Active;
        $share->save();

        return $token->token;
    }

    private function read(string $token, string $path = '', string|null $cursor = null, bool $head = false): SharedPage
    {
        $permit = $this->app->make(ReadPermits::class)->issue($token);

        return $this->app->make(ActorStore::class)->actAsSystem(fn () => $this->app->make(CommandBus::class)->run(new ReadShare($permit->reference, $path, $cursor, $head)));
    }

    /**
     * @return list<ShareAuditType>
     */
    private function auditTypes(): array
    {
        return array_values(ShareAudit::query()->orderBy('created_at')->orderBy('id')->get()->map(fn (ShareAudit $audit) => $audit->type)->all());
    }

    private function insertComments(int $count): void
    {
        $now = CarbonImmutable::now();
        $rows = [];

        for ($position = 0; $position < $count; $position++) {
            $rows[] = ['id' => strtolower((string) Str::ulid()), 'target_type' => Document::LINK_TYPE, 'target_id' => $this->document->id, 'author_type' => 'user', 'author_id' => TestIds::of(9), 'body' => "Comment {$position}", 'submission_key' => "key-{$position}", 'submission_hash' => str_repeat('a', 64), 'created_at' => $now->addSeconds($position)];
        }

        DB::table('comments')->insert($rows);
    }
}
