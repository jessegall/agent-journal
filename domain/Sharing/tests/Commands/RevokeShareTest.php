<?php

declare(strict_types=1);

namespace Domain\Sharing\Tests\Commands;

use App\Contracts\Actors\CurrentActorSetter;
use App\Contracts\Bus\Command;
use App\Contracts\Bus\CommandBus;
use App\Support\ActorContext;
use App\Support\RecordIdentity;
use App\Support\RequestKey;
use App\Values\OwnerAuthority;
use Domain\Sharing\Commands\DisableShareGateway\DisableShareGatewayCommand;
use Domain\Sharing\Commands\RevokeShare\RevokeShareCommand;
use Domain\Sharing\Enums\GatewayOperationType;
use Domain\Sharing\Enums\ShareStatus;
use Domain\Sharing\Events\ShareActivated;
use Domain\Sharing\Events\ShareRevoked;
use Domain\Sharing\Models\Share;
use Domain\Sharing\Models\ShareGatewayConfiguration;
use Domain\Sharing\Models\ShareGatewayOperation;
use Domain\Sharing\Tests\Fixtures\ShareFixtures;
use Domain\Sharing\Tests\TestCase;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Str;
use Tests\Support\CommitsHookRows;
use Tests\Support\Sharing\FakeShareGateway;
use Tests\Support\TestActors;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A revoke that rolls back raises nothing, and a second revoke of an ended share raises nothing.
 */
#[TimeLimit(seconds: 5, reason: 'Its commands commit for real, and it empties nine tables around each test.')]
final class RevokeShareTest extends TestCase
{
    use CommitsHookRows;

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

        $this->journal->owner();
        $this->configuration = ShareGatewayConfiguration::create(FakeShareGateway::settings());
        $this->share = $this->grantForADay(TestActors::record('binders.binder', 1), $this->configuration);
        ShareGatewayOperation::create($this->configuration, GatewayOperationType::Open);

        Event::listen([
            ShareActivated::class,
            ShareRevoked::class,
        ], function (object $event): void {
            $this->received[] = $event;
        });
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
        $this->assertSame(ShareStatus::Pending, $this->share->fresh()?->status);

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
        $this->app->make(CurrentActorSetter::class)->set(ActorContext::of($this->journal->ownerUser()), new OwnerAuthority('test'));
        $this->app->make(RequestKey::class)->set((string) Str::ulid());

        return $this->app->make(CommandBus::class)->run($command);
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
}
