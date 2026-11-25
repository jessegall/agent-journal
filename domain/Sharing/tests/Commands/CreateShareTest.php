<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\CommandBus;
use App\Exceptions\RequestKeyConflict;
use App\Exceptions\RequestKeyMissing;
use App\Exceptions\StackLockTimedOut;
use App\Models\Access\User;
use App\Models\CommandRules\CommandReceipt;
use App\Models\Records\Link;
use App\Support\ActorIdentity;
use App\Support\OperationDeadline;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use App\Support\ShareRecordRegistry;
use App\Values\OwnerAuthority;
use Carbon\CarbonImmutable;
use Domain\Documents\Commands\CreateDocument\CreateDocumentCommand;
use Domain\Documents\Models\Document;
use Domain\Sharing\Commands\CreateShare\CreateShareCommand;
use Domain\Sharing\Commands\SaveSharePreview\SaveSharePreviewCommand;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\ShareAuditType;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Exceptions\ShareDurationInvalid;
use Domain\Sharing\Exceptions\SharePreviewRefused;
use Domain\Sharing\Exceptions\ShareQuotaReached;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareAudit;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Models\ShareInstallation;
use Domain\Sharing\Models\ShareMember;
use Domain\Sharing\Models\SharePreview;
use Domain\Sharing\Support\SavedSharePreview;
use Domain\Sharing\Support\ShareDuration;
use Domain\Sharing\Support\ShareGrant;
use Domain\Sharing\Support\ShareLinkResolver;
use Domain\Sharing\Support\ShareSummary;
use Domain\Sharing\Support\ShareToken;
use Domain\Sharing\Tests\Fixtures\ShareFixtures;
use Domain\Sharing\Tests\Support\FakeShareGateway;
use Domain\Sharing\Tests\Support\RegistersShareDomains;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * The owner creates a share from a fresh preview under a request key: it holds a new token, the selected members at
 * scope version 1, an open request for its gateway and its audit, answers with its id, number and state only, and
 * runs once per key. The duration is checked and the 101st live share refused.
 */
#[TestsCommand(CreateShareCommand::class)]
final class CreateShareTest extends TestCase
{
    use CommitsHookRows;
    use RegistersShareDomains;

    private const string PENDING_HAS_NO_ADDRESS = 'A pending share has no address yet.';

    private const string OWNER_ONLY_ADDRESS = 'Only the owner reads the address.';

    private const string KEY = '01JD8X0G9M3QZ6V4K2CREATE01';

    private RecordIdentity $root;

    private ShareGatewayConfiguration $configuration;

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
        'share_gateway_endpoints',
    ];

    private Document $document;

    private User $owner;

    protected function setUp(): void
    {
        parent::setUp();

        $this->registerShareDomain(BindersDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $this->journal->owner();
        $this->app->instance(BinderPublications::class, new BinderPublications());
        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->root = TestActors::record('binders.binder', 1);

        foreach ([
            101,
            102,
        ] as $number) {
            Link::create($this->root->type, $this->root->id, 'binders.sheet', TestIds::of($number));
        }

        $this->journal->actAsUserId($this->journal->ownerUser()->id);
    }

    public function test_the_owner_creates_a_share_from_a_fresh_preview_and_reads_its_url(): void
    {
        $summary = $this->create($this->preview([TestIds::of(101)]));
        $share = Share::query()->findOrFail($summary->shareId);

        $this->assertSame(ShareStatus::Pending, $summary->state);
        $this->assertSame($share->number, $summary->number);
        $this->assertSame(Share::FIRST_SCOPE_VERSION, $share->scope_version);
        $this->assertSame([TestIds::of(101)], ShareMember::query()->readAll('one member')->pluck('target_id')->all());

        $this->assertSame(
            GatewayOperationType::Open,
            ShareGatewayOperation::query()->readAll('one operation')->sole()->type,
        );

        $this->assertSame(ShareAuditType::Created, ShareAudit::query()->readAll('one audit')->sole()->type);
        $this->assertTrue(SharePreview::query()->readAll('one preview')->sole()->consumed_at !== null);
        $this->assertSame(ShareToken::digestOf((string) $share->token_ciphertext), $share->token_digest);

        $this->assertEqualsWithDelta(
            CarbonImmutable::now()->addMinutes(ShareDuration::STANDARD_MINUTES)->getTimestamp(),
            $share->expires_at->getTimestamp(),
            5,
        );

        $links = $this->app->make(ShareLinkResolver::class);

        $this->assertTrue(
            $links->linkFor(ActorIdentity::of($this->journal->ownerUser()), $share->id)->isEmpty(),
            self::PENDING_HAS_NO_ADDRESS,
        );

        $share->status = ShareStatus::Active;
        $share->save();

        $this->assertSame(
            FakeShareGateway::PUBLIC_ORIGIN.'/s/'.$share->token_ciphertext,
            $links->linkFor(ActorIdentity::of($this->journal->ownerUser()), $share->id)->get(),
        );

        $this->assertTrue(
            $links->linkFor(TestActors::user(8), $share->id)->isEmpty(),
            self::OWNER_ONLY_ADDRESS,
        );
    }

    public function test_the_answer_and_the_receipt_hold_no_token_or_address(): void
    {
        $summary = $this->create($this->preview([]));
        $token = (string) Share::query()->findOrFail($summary->shareId)->token_ciphertext;
        $receipt = CommandReceipt::query()->sole();

        $this->assertStringNotContainsString($token, (string) json_encode($receipt->getAttributes()));

        $this->assertStringNotContainsString(
            FakeShareGateway::PUBLIC_ORIGIN,
            (string) json_encode($receipt->getAttributes()),
        );

        $this->assertSame([
            'shareId',
            'number',
            'state',
        ], array_keys(get_object_vars($summary)));
    }

    public function test_a_repeat_with_the_same_key_returns_the_same_share_and_a_changed_payload_conflicts(): void
    {
        $saved = $this->preview([]);
        $first = $this->create($saved);
        $repeat = $this->create($saved);

        $this->assertEquals($first, $repeat);
        $this->assertSame(1, Share::query()->count());
        $this->assertThrows(fn () => $this->create($saved, 60), RequestKeyConflict::class);
    }

    public function test_a_creation_without_a_request_key_is_refused(): void
    {
        $saved = $this->preview([]);

        $this->assertThrows(
            fn () => $this->app->make(CommandBus::class)->run(
                new CreateShareCommand($saved->previewId, $saved->checksum, 60, self::KEY),
            ),
            RequestKeyMissing::class,
        );

        $this->assertSame(0, Share::query()->count());
    }

    public function test_the_shortest_and_the_longest_duration_work(): void
    {
        $short = $this->create($this->preview([]), 1, '01JD8X0G9M3QZ6V4K2CREATE02');
        $long = $this->create($this->preview([]), 43_200, '01JD8X0G9M3QZ6V4K2CREATE03');

        $this->assertEqualsWithDelta(
            CarbonImmutable::now()->addMinute()->getTimestamp(),
            Share::query()->findOrFail($short->shareId)->expires_at->getTimestamp(),
            5,
        );

        $this->assertEqualsWithDelta(
            CarbonImmutable::now()->addDays(30)->getTimestamp(),
            Share::query()->findOrFail($long->shareId)->expires_at->getTimestamp(),
            5,
        );
    }

    public function test_a_duration_outside_one_minute_to_thirty_days_is_refused_with_no_rows_left(): void
    {
        foreach ([
            0,
            43_201,
        ] as $index => $minutes) {
            $saved = $this->preview([TestIds::of(101)]);

            $this->assertThrows(
                fn () => $this->create($saved, $minutes, "01JD8X0G9M3QZ6V4K2REFUSE0{$index}"),
                ShareDurationInvalid::class,
            );
        }

        $this->assertSame(0, Share::query()->count());
        $this->assertSame(0, ShareMember::query()->count());
        $this->assertSame(0, ShareGatewayOperation::query()->count());
        $this->assertSame(0, ShareAudit::query()->count());
        $this->assertSame(0, SharePreview::query()->whereNotNull('consumed_at')->count());
    }

    public function test_a_used_preview_is_refused(): void
    {
        $saved = $this->preview([]);
        $this->create($saved);

        $this->assertThrows(
            fn () => $this->create($saved, ShareDuration::STANDARD_MINUTES, '01JD8X0G9M3QZ6V4K2CREATE04'),
            SharePreviewRefused::class,
            SharePreviewRefused::consumed($saved->previewId)->getMessage(),
        );
    }

    public function test_the_hundred_and_first_live_share_is_refused(): void
    {
        for ($index = 0; $index < Share::LIVE_LIMIT; $index++) {
            $this->grantForADay(TestActors::record('binders.binder', 1000 + $index), $this->configuration);
        }

        $saved = $this->preview([]);

        $this->assertThrows(fn () => $this->create($saved), ShareQuotaReached::class);
        $this->assertSame(Share::LIVE_LIMIT, Share::query()->count());
    }

    #[TimeLimit(5, 'It fills the live-share quota of a hundred shares first.')]
    public function test_an_expired_share_whose_state_has_not_caught_up_does_not_count(): void
    {
        for ($index = 0; $index < Share::LIVE_LIMIT; $index++) {
            Share::create(
                TestActors::record('binders.binder', 1000 + $index),
                CarbonImmutable::now()->subMinute(),
                new ShareGrant(
                    $this->journal->ownerUser()->id,
                    $this->configuration->id,
                    $this->configuration->configuration_version,
                    ShareToken::generate(),
                ),
            );
        }

        $this->assertSame(ShareStatus::Pending, $this->create($this->preview([]))->state);
    }

    public function test_the_owner_lists_creates_revokes_and_prints_an_address_from_the_cli(): void
    {
        $this->owner = $this->journal->ownerUser();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorIdentity::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );

        $this->app->make(CommandBus::class)->run(new CreateDocumentCommand('Design', 'What we build', <<<'TEXT'
        # Goal
        Ship it.
        TEXT));

        $this->app->make(CurrentActorSetter::class)->clear();
        $this->document = Document::query()->where('number', 1)->sole();

        $this->app->make(CurrentActorSetter::class)->set(
            ActorIdentity::forUser($this->owner->id),
            new OwnerAuthority('test'),
        );

        $this->app->make(CommandBus::class)->run(
            new SaveSharePreviewCommand(
                $this->document->shareIdentity()->type,
                $this->document->id,
                [],
                $this->configuration->id,
            ),
        );

        $this->app->make(CurrentActorSetter::class)->clear();
        $preview = SharePreview::query()->sole();

        $this->artisan(
            'share:create',
            [
                'preview' => $preview->id,
                '--minutes' => '60',
            ],
        )->expectsOutputToContain('is pending')->assertExitCode(0);

        $share = Share::query()->sole();

        $this->artisan('share:list')->expectsOutputToContain($share->id)->doesntExpectOutputToContain(
            FakeShareGateway::PUBLIC_ORIGIN,
        )->assertExitCode(0);

        $this->artisan('share:url', ['share' => $share->id])->assertExitCode(1);

        $share->status = ShareStatus::Active;
        $share->save();

        $this->artisan('share:url', ['share' => $share->id])->expectsOutputToContain(
            FakeShareGateway::PUBLIC_ORIGIN.'/s/',
        )->assertExitCode(0);

        $this->artisan(
            'share:revoke',
            ['share' => $share->id],
        )->expectsOutputToContain('is revoked')->assertExitCode(0);

        $this->artisan('share:url', ['share' => $share->id])->assertExitCode(1);

        $this->assertStringNotContainsString(
            FakeShareGateway::PUBLIC_ORIGIN,
            (string) json_encode($this->app->make(ConnectionInterface::class)->table('command_receipts')->get()->all()),
        );
    }

    public function test_two_creations_for_the_last_slot_on_two_configurations_admit_one(): void
    {
        $first = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $second = ShareGatewayConfiguration::create(FakeShareGateway::settings());

        for ($index = 1; $index < Share::LIVE_LIMIT; $index++) {
            $this->grantForADay(TestActors::record('binders.binder', 1000 + $index), $first);
        }

        DB::transaction(fn () => ShareInstallation::create());
        $this->journal->actAsUserId($this->journal->ownerUser()->id);

        $saved = $this->app->make(CommandBus::class)->run(
            new SaveSharePreviewCommand('binders.binder', TestIds::of(1), [], $second->id),
        );

        config(['database.connections.second_creator' => config('database.connections.'.config('database.default'))]);
        $secondCreator = DB::connection('second_creator');
        $secondCreator->beginTransaction();

        try {
            $secondCreator->table('share_installations')->lockForUpdate()->sole();
            $secondCreator->table('shares')->insert($this->lastSlotRow($first));

            $this->app->instance(OperationDeadline::class, new OperationDeadline(500));

            $this->assertThrows(
                fn () => $this->createRacing($saved, '01JD8X0G9M3QZ6V4K2RACE0001'),
                StackLockTimedOut::class,
            );

            $secondCreator->commit();
        } finally {
            if ($secondCreator->transactionLevel() > 0) {
                $secondCreator->rollBack();
            }

            DB::purge('second_creator');
        }

        $this->assertThrows(
            fn () => $this->createRacing($saved, '01JD8X0G9M3QZ6V4K2RACE0002'),
            ShareQuotaReached::class,
        );

        $this->assertSame(Share::LIVE_LIMIT, Share::query()->count());
        $this->assertSame(0, Share::query()->where('share_gateway_configuration_id', $second->id)->count());
    }

    /**
     * @param  list<string>  $selectedIds
     */
    private function preview(array $selectedIds): SavedSharePreview
    {
        return $this->app->make(CommandBus::class)->run(
            new SaveSharePreviewCommand($this->root->type, $this->root->id, $selectedIds, $this->configuration->id),
        );
    }

    private function create(
        SavedSharePreview $saved,
        int $minutes = ShareDuration::STANDARD_MINUTES,
        string $key = self::KEY,
    ): ShareSummary {
        $this->app->make(RequestKey::class)->set($key);

        return $this->app->make(CommandBus::class)->run(
            new CreateShareCommand($saved->previewId, $saved->checksum, $minutes, $key),
        );
    }

    /**
     * A share the journal's owner granted on the root for a day, kept under the root's reference.
     */
    private function grantForADay(RecordIdentity $root, ShareGatewayConfiguration $configuration): Share
    {
        $name = $root->reference();

        return $this->journal->fixtures(ShareFixtures::class)->grantForADay(
            $name,
            $root,
            $configuration,
        )->shareCalled($name);
    }

    /**
     * The 100th live share, written by the other creator in its own transaction under the installation lock.
     *
     * @return array<string, mixed>
     */
    private function lastSlotRow(ShareGatewayConfiguration $configuration): array
    {
        $now = CarbonImmutable::now();

        return [
            'id' => strtolower((string) Str::ulid()),
            'number_group_id' => Share::query()->value('number_group_id'),
            'number' => 1_000_000,
            'status' => ShareStatus::Pending->value,
            'root_type' => 'binders.binder',
            'root_id' => TestIds::of(1),
            'owner_user_id' => $this->journal->ownerUser()->id,
            'share_gateway_configuration_id' => $configuration->id,
            'configuration_version' => $configuration->configuration_version,
            'scope_version' => Share::FIRST_SCOPE_VERSION,
            'expires_at' => $now->addDay(),
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }

    private function createRacing(SavedSharePreview $saved, string $key): Share
    {
        $this->app->forgetScopedInstances();
        $this->journal->actAsUserId($this->journal->ownerUser()->id);
        $this->app->make(RequestKey::class)->set($key);

        $summary = $this->app->make(CommandBus::class)->run(
            new CreateShareCommand($saved->previewId, $saved->checksum, ShareDuration::STANDARD_MINUTES, $key),
        );

        return Share::query()->findOrFail($summary->shareId);
    }
}
