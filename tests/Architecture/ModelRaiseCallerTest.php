<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Bus\Support\CommandRegistry;
use Tests\Architecture\Support\CommandReach;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\RaiseCallers;
use Tests\Fixtures\RaiseCallers\Attributes\InCommandTransaction;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * A model transition that raises a fact runs only inside a unit (plan 40): every caller of a transition the lists in
 * tests/Architecture/RaisingTransitions name is reached from a registered command's handler, is a required listener
 * or is a model; a public listener, a job, a console command, a controller or unreached code fails.
 */
#[TimeLimit(seconds: 30, reason: 'It parses every PHP file of app and the domains.')]
final class ModelRaiseCallerTest extends TestCase
{
    /**
     * The guideline a failure points to.
     */
    private const string GUIDELINE = '.ai/guidelines/models-raise-their-events.md';

    /**
     * The attribute that marks a listener required in the command's transaction (plan 40 task 1579).
     */
    private const string REQUIRED_LISTENER = 'App\Contracts\Attributes\InCommandTransaction';

    private const string FIXTURES = 'tests/Fixtures/RaiseCallers';

    public function test_every_migrated_transition_is_called_only_inside_a_unit(): void
    {
        $reach = CommandReach::of($this->app->make(CommandRegistry::class), base_path());
        $callers = new RaiseCallers(
            base_path(),
            RaiseCallers::migrated(base_path()),
            $reach->handlersByFile,
            self::REQUIRED_LISTENER,
        );
        $violations = $callers->violationsIn([app_path(), ...DomainFiles::domainCode()]);

        $this->assertSame(
            [],
            $violations,
            'Call a raising transition only inside a unit ('.self::GUIDELINE."):\n"
                .implode("\n", $violations),
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
                .'from a console command; call it from a command handler or a required listener',
            self::FIXTURES.'/Listeners/CertifiedShipper.php:19 CertifiedShipper::handle calls Shipment::ship, which '
                .'raises a fact, from a public listener; call it from a command handler or a required listener',
        ], $callers->violationsIn([base_path(self::FIXTURES)]));
    }
}
