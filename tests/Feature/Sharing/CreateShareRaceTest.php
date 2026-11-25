<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Commands\Sharing\CreateShare\CreateShareCommand;
use App\Commands\Sharing\SaveSharePreview\SaveSharePreviewCommand;
use App\Contracts\Bus\CommandBus;
use App\Enums\Sharing\ShareState;
use App\Exceptions\ShareQuotaReached;
use App\Exceptions\StackLockTimedOut;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareInstallation;
use App\Support\Access\AccessSettings;
use App\Support\OperationDeadline;
use App\Support\RequestKey;
use App\Support\SavedSharePreview;
use App\Support\ShareDuration;
use App\Support\ShareRecordRegistry;
use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\Fixtures\Domains\Binders\BinderPublications;
use Tests\Fixtures\Domains\Binders\BindersDomain;
use Tests\Support\CommitsHookRows;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\RegistersShareDomains;
use Tests\Support\Sharing\TestShares;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TestActors;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Two creations for the last live slot, on two gateway configurations and two independent connections: the second
 * waits on the installation lock the first holds, and once the first has taken the slot the second is refused.
 */
#[TimeLimit(seconds: 10, reason: 'It waits out an installation lock held on a second PostgreSQL connection.')]
final class CreateShareRaceTest extends TestCase
{
    use CommitsHookRows;
    use RegistersShareDomains;
    use StartsAgentRequests;

    private const array TABLES = [
        'command_receipts',
        'share_audits',
        'share_members',
        'share_gateway_operations',
        'shares',
        'share_previews',
        'share_gateway_endpoints',
        'share_gateway_configurations',
        'share_installations',
    ];

    public function test_two_creations_for_the_last_slot_on_two_configurations_admit_one(): void
    {
        $this->registerShareDomain(BindersDomain::class);
        $this->app->make(ShareRecordRegistry::class)->checkRelations();
        $this->app->instance(AccessSettings::class, TestActors::accessSettings(9));
        $this->app->instance(BinderPublications::class, new BinderPublications());
        $first = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $second = ShareGatewayConfiguration::create(FakeShareGateway::settings());

        for ($index = 1; $index < Share::LIVE_LIMIT; $index++) {
            TestShares::grantForADay(TestActors::record('binders.binder', 1000 + $index), $first);
        }

        DB::transaction(fn () => ShareInstallation::create());
        $this->startTestUserRequest(9);
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
            $this->assertThrows(fn () => $this->create($saved, '01JD8X0G9M3QZ6V4K2RACE0001'), StackLockTimedOut::class);

            $secondCreator->commit();
        } finally {
            if ($secondCreator->transactionLevel() > 0) {
                $secondCreator->rollBack();
            }

            DB::purge('second_creator');
        }

        $this->assertThrows(fn () => $this->create($saved, '01JD8X0G9M3QZ6V4K2RACE0002'), ShareQuotaReached::class);
        $this->assertSame(Share::LIVE_LIMIT, Share::query()->count());
        $this->assertSame(0, Share::query()->where('share_gateway_configuration_id', $second->id)->count());
    }

    private function create(SavedSharePreview $saved, string $key): Share
    {
        $this->app->forgetScopedInstances();
        $this->startTestUserRequest(9);
        $this->app->make(RequestKey::class)->set($key);
        $summary = $this->app->make(CommandBus::class)->run(
            new CreateShareCommand($saved->previewId, $saved->checksum, ShareDuration::STANDARD_MINUTES, $key),
        );

        return Share::query()->findOrFail($summary->shareId);
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
            'state' => ShareState::Pending->value,
            'root_type' => 'binders.binder',
            'root_id' => TestIds::of(1),
            'owner_user_id' => TestIds::of(9),
            'share_gateway_configuration_id' => $configuration->id,
            'configuration_version' => $configuration->configuration_version,
            'scope_version' => Share::FIRST_SCOPE_VERSION,
            'expires_at' => $now->addDay(),
            'created_at' => $now,
            'updated_at' => $now,
        ];
    }
}
