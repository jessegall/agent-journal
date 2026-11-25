<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Attributes\Listeners\InCommandTransaction as TransactionListener;
use App\Support\CommandRegistry;
use Tests\Architecture\Support\CommandReach;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\RaiseCallers;
use Tests\Architecture\Support\UnitRoots;
use Tests\Fixtures\RaiseCallers\Attributes\InCommandTransaction;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A model transition that raises a fact runs only inside a unit: every caller of a transition the lists in
 * tests/Architecture/RaisingTransitions name is reached from a registered command's handler, is a transaction listener
 * or is a model; a public listener, a job, a console command, a controller or unreached code fails.
 */
#[TimeLimit(seconds: 60, reason: 'It parses every PHP file of app and the domains and follows the command reach twice.')]
final class ModelRaiseCallerTest extends TestCase
{
    private const string HOW_TO_FIX = "Call a raising transition only inside a unit (%s):\n";

    /**
     * The guideline a failure points to.
     */
    private const string GUIDELINE = '.ai/guidelines/models-raise-their-events.md';

    /**
     * The attribute that marks a listener required in the command's transaction.
     */
    private const string TRANSACTION_LISTENER = TransactionListener::class;

    private const string FIXTURES = 'tests/Fixtures/RaiseCallers';

    public function test_every_migrated_transition_is_called_only_inside_a_unit(): void
    {
        $folders = [app_path(), ...DomainFiles::domainCode()];
        $registry = $this->app->make(CommandRegistry::class);
        $roots = UnitRoots::in($folders, self::TRANSACTION_LISTENER, $this->app);
        $nearReach = CommandReach::of($registry, base_path(), $this->app, $roots);
        $reach = CommandReach::of($registry, base_path(), $this->app, [
            ...$roots,
            ...UnitRoots::requestListenersIn($folders, $nearReach->handlersByFile, base_path()),
        ]);
        $callers = new RaiseCallers(
            base_path(),
            RaiseCallers::migrated(base_path()),
            $reach->handlersByFile,
            self::TRANSACTION_LISTENER,
        );
        $violations = $callers->violationsIn($folders);

        $this->assertSame(
            [],
            $violations,
            sprintf(self::HOW_TO_FIX, self::GUIDELINE).implode("\n", $violations),
        );
    }

    public function test_a_public_listener_and_a_console_command_calling_a_transition_fail(): void
    {
        $handler = self::FIXTURES.'/Handlers/ShipHandler.php';
        $callers = new RaiseCallers(
            base_path(),
            ['Shipment::ship'],
            [$handler => ['ShipHandler']],
            InCommandTransaction::class,
        );

        $this->assertSame([
            self::FIXTURES.'/Console/ShipCommand.php:19 ShipCommand::handle calls Shipment::ship, which raises a fact, '
                .'from a console command; call it from a command handler or a transaction listener',
            self::FIXTURES.'/Listeners/ShipCertified.php:19 ShipCertified::handle calls Shipment::ship, which '
                .'raises a fact, from a public listener; call it from a command handler or a transaction listener',
        ], $callers->violationsIn([base_path(self::FIXTURES)]));
    }
}
