<?php

declare(strict_types=1);

namespace Tests\Machinery\Bus;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Domains\DomainAvailability;
use App\Exceptions\CommandRefused;
use App\Exceptions\DomainDisabled;
use App\Support\CommandScope;
use App\Support\MiddlewareDeclaration;
use Domain\Plans\Commands\StartPlan\StartPlanCommand;
use Domain\Plans\Commands\StartPlan\StartPlanHandler;
use Domain\Plans\PlansDomain;
use Domain\Rules\RulesDomain;
use Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck\ShuffleDeckCommand;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefusesAll;
use Tests\Support\DomainBoot;
use Tests\Support\TestIds;

/**
 * A command of a domain that is not available is refused after Core's first steps and before its handler or any of
 * its middleware is built; middleware of an unavailable domain is left out of other owners' commands unbuilt.
 */
final class DomainDisabledCommandsTest extends CommandBusTestCase
{
    private const string HANDLER_BUILT = 'The handler of a switched-off domain was built.';

    private const string MIDDLEWARE_BUILT = 'Middleware of a switched-off domain was built.';

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, RulesDomain::class);
    }

    public function test_a_switched_off_domains_command_is_refused_for_everyone_without_building_its_handler(): void
    {
        $this->installCommandModules();
        $this->switchOff('Plans');
        $built = false;
        $this->app->resolving(StartPlanHandler::class, function () use (&$built): void {
            $built = true;
        });

        $this->journal->actAsUserId(TestIds::of(1));
        $this->assertRefusedAsDisabled(new StartPlanCommand(TestIds::of(5)));

        $this->journal->actAsAgentIds(TestIds::of(2), TestIds::of(20));
        $this->assertRefusedAsDisabled(new StartPlanCommand(TestIds::of(5)));

        $this->assertFalse($built, self::HANDLER_BUILT);
    }

    public function test_middleware_of_a_switched_off_domain_is_left_out_unbuilt(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(RefusesAll::class, CommandScope::all()));
        $this->switchOff('Notes');
        $built = false;
        $this->app->resolving(RefusesAll::class, function () use (&$built): void {
            $built = true;
        });
        $this->journal->actAsUserId(TestIds::of(1));

        $this->app->make(CommandBus::class)->run(new ShuffleDeckCommand('red'));

        $this->assertFalse($built, self::MIDDLEWARE_BUILT);
    }

    public function test_with_every_domain_on_the_middleware_runs_as_before(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(RefusesAll::class, CommandScope::all()));
        $this->journal->actAsUserId(TestIds::of(1));

        $this->expectException(CommandRefused::class);

        $this->app->make(CommandBus::class)->run(new ShuffleDeckCommand('red'));
    }

    private function switchOff(string $owner): void
    {
        $this->app->instance(DomainAvailability::class, new class($owner) implements DomainAvailability
        {
            public function __construct(private readonly string $switchedOff) {}

            public function isEnabled(string $owner): bool
            {
                return $owner !== $this->switchedOff;
            }
        });
    }

    private function assertRefusedAsDisabled(StartPlanCommand $command): void
    {
        try {
            $this->app->make(CommandBus::class)->run($command);
            $this->fail('A command of a switched-off domain ran.');
        } catch (DomainDisabled $refused) {
            $this->assertSame(DomainDisabled::for('Plans', StartPlanCommand::class)->getMessage(), $refused->getMessage());
        }
    }
}
