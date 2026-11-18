<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\Exceptions\DomainDisabled;
use App\Bus\Support\CommandScope;
use App\Bus\Support\MiddlewareDeclaration;
use App\Contracts\DomainAvailability;
use Domain\Plans\Commands\StartPlan;
use Domain\Plans\Handlers\StartPlanHandler;
use Tests\Fixtures\Modules\Cards\Commands\ShuffleDeck;
use Tests\Fixtures\Modules\Notes\CommandMiddleware\RefusesAll;
use Tests\Support\TestIds;

/**
 * A command of a domain that is not available is refused after Core's first steps and before its handler or any of
 * its middleware is built; middleware of an unavailable domain is left out of other owners' commands unbuilt.
 */
final class DomainDisabledCommandsTest extends CommandBusTestCase
{
    public function test_a_command_of_a_switched_off_domain_is_refused_for_users_and_agents_without_building_its_handler(): void
    {
        $this->installCommandModules();
        $this->switchOff('Plans');
        $built = false;
        $this->app->resolving(StartPlanHandler::class, function () use (&$built): void {
            $built = true;
        });

        $this->startUserRequestAs(TestIds::of(1));
        $this->assertRefusedAsDisabled(new StartPlan(TestIds::of(5)));

        $this->startRequestAs(TestIds::of(2), TestIds::of(20));
        $this->assertRefusedAsDisabled(new StartPlan(TestIds::of(5)));

        $this->assertFalse($built, 'The handler of a switched-off domain was built.');
    }

    public function test_middleware_of_a_switched_off_domain_is_left_out_unbuilt(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(RefusesAll::class, CommandScope::all()));
        $this->switchOff('Notes');
        $built = false;
        $this->app->resolving(RefusesAll::class, function () use (&$built): void {
            $built = true;
        });
        $this->startUserRequestAs(TestIds::of(1));

        $this->app->make(CommandBus::class)->run(new ShuffleDeck('red'));

        $this->assertFalse($built, 'Middleware of a switched-off domain was built.');
    }

    public function test_with_every_domain_on_the_middleware_runs_as_before(): void
    {
        $this->installCommandModules(MiddlewareDeclaration::around(RefusesAll::class, CommandScope::all()));
        $this->startUserRequestAs(TestIds::of(1));

        $this->expectException(CommandRefused::class);

        $this->app->make(CommandBus::class)->run(new ShuffleDeck('red'));
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

    private function assertRefusedAsDisabled(StartPlan $command): void
    {
        try {
            $this->app->make(CommandBus::class)->run($command);
            $this->fail('A command of a switched-off domain ran.');
        } catch (DomainDisabled $refused) {
            $this->assertSame('Plans is switched off, so '.StartPlan::class.' does not run.', $refused->getMessage());
        }
    }
}
