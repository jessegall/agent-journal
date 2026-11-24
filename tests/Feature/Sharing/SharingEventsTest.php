<?php

declare(strict_types=1);

namespace Tests\Feature\Sharing;

use App\Commands\Sharing\ClaimGatewayOperation\ClaimGatewayOperationCommand;
use App\Commands\Sharing\DisableShareGateway\DisableShareGatewayCommand;
use App\Commands\Sharing\RecordGatewayOutcome\RecordGatewayOutcomeCommand;
use App\Commands\Sharing\RevokeShare\RevokeShareCommand;
use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Enums\GatewayOperationType;
use App\Enums\GatewayOutcome;
use App\Enums\ShareState;
use App\Events\Sharing\ShareActivated;
use App\Events\Sharing\ShareRevoked;
use App\Models\Sharing\Share;
use App\Models\Sharing\ShareGatewayConfiguration;
use App\Models\Sharing\ShareGatewayOperation;
use App\Support\ClaimedGatewayOperation;
use App\Support\RequestKey;
use App\Values\OwnerAuthority;
use Domain\Access\Support\AccessSettings;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\RunsTrustedCommands;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\Sharing\TestShares;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Sharing's lifecycle events reach a listener only after the transition committed, carry the share's id, gateway
 * configuration, state and scope version and nothing secret, and a replayed or rolled-back transition raises none.
 */
#[TimeLimit(seconds: 5, reason: 'Its commands commit for real, and it empties nine tables around each test.')]
final class SharingEventsTest extends TestCase
{
    use CommitsHookRows;
    use RunsTrustedCommands;

    private const string TRIGGER_REFUSAL = 'refused for the test';

    private const array TABLES = [
        'command_receipts',
        'share_audits',
        'share_members',
        'share_gateway_operations',
        'shares',
        'share_gateway_endpoints',
        'share_gateway_configurations',
        'share_installations',
        'number_groups',
    ];

    private const string RUN = '01JD8X0G9M3QZ6V4K2RUN0000A';

    /**
     * Makes the disable fail after it revoked the share and raised ShareRevoked, when it writes its own audit, so its
     * transaction rolls back with the event already raised.
     */
    private const string REFUSE_DISABLED_AUDIT = <<<'SQL'
        CREATE FUNCTION refuse_disabled_audit() RETURNS trigger LANGUAGE plpgsql AS $$
        BEGIN
            IF NEW.reason_code = 'disabled' THEN
                RAISE EXCEPTION 'refused for the test';
            END IF;
            RETURN NEW;
        END $$;
        CREATE TRIGGER refuse_disabled_audit BEFORE INSERT ON share_audits
            FOR EACH ROW EXECUTE FUNCTION refuse_disabled_audit();
        SQL;

    private ShareGatewayConfiguration $configuration;

    private Share $share;

    /**
     * @var list<object>
     */
    private array $received = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(AccessSettings::class, TestActors::accessSettings(9));
        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->share = TestShares::grantForADay(TestActors::record('binders.binder', 1), $this->configuration);
        ShareGatewayOperation::create($this->configuration, GatewayOperationType::Open);
        Event::listen([ShareActivated::class, ShareRevoked::class], function (object $event): void {
            $this->received[] = $event;
        });
    }

    public function test_share_activated_reaches_a_listener_after_commit_once_and_not_on_a_replay(): void
    {
        $claim = $this->asSystem(new ClaimGatewayOperationCommand(self::RUN));
        $this->assertInstanceOf(ClaimedGatewayOperation::class, $claim);
        $outcome = new RecordGatewayOutcomeCommand(
            self::RUN,
            $claim->operation->operationId,
            $claim->operation->endpointVersion,
            $claim->operation->leaseToken,
            GatewayOutcome::Succeeded,
        );

        $this->asSystem($outcome);
        $this->asSystem($outcome);

        $this->assertCount(1, $this->received);
        $this->assertInstanceOf(ShareActivated::class, $this->received[0]);
        $this->assertSame(
            [$this->share->id, $this->configuration->id, ShareState::Active, Share::FIRST_SCOPE_VERSION],
            [
                $this->received[0]->share->shareId,
                $this->received[0]->share->configurationId,
                $this->received[0]->share->state,
                $this->received[0]->share->scopeVersion,
            ],
        );
        $this->assertStringNotContainsString(
            (string) $this->share->fresh()?->token_ciphertext,
            serialize($this->received[0]),
        );
    }

    public function test_a_rolled_back_revoke_raises_nothing_and_a_second_revoke_raises_nothing(): void
    {
        $database = $this->app->make(ConnectionInterface::class);
        $database->unprepared(self::REFUSE_DISABLED_AUDIT);

        try {
            $this->assertThrows(
                fn () => $this->asOwner(new DisableShareGatewayCommand($this->configuration->id, (string) Str::ulid())),
                QueryException::class,
                self::TRIGGER_REFUSAL,
            );
        } finally {
            $database->unprepared('DROP TRIGGER refuse_disabled_audit ON share_audits; DROP FUNCTION refuse_disabled_audit();');
        }

        $this->assertSame([], $this->received);
        $this->assertSame(ShareState::Pending, $this->share->fresh()?->state);

        $this->asOwner(new RevokeShareCommand($this->share->id, (string) Str::ulid()));
        $this->asOwner(new RevokeShareCommand($this->share->id, (string) Str::ulid()));

        $this->assertSame([ShareRevoked::class], array_map(fn (object $event) => $event::class, $this->received));
    }

    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    private function asOwner(Command $command): mixed
    {
        $this->app->forgetScopedInstances();
        $this->app->make(CurrentActorSetter::class)->set(TestActors::user(9), new OwnerAuthority('test'));
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
    }
}
