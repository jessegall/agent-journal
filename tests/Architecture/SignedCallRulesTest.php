<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Support\CallRoutes;
use App\Mcp\Servers\JournalServer;
use App\Processes\Attributes\JournalRoute;
use App\Processes\Enums\JournalRouteType;
use Illuminate\Routing\Route;
use Illuminate\Support\Facades\Route as Routes;
use ReflectionClass;
use Spatie\LaravelData\Data;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\SignedCallRules;
use Tests\Fixtures\SignedCalls\PlantedController;
use Tests\Fixtures\SignedCalls\PlantedRetireCall;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Every signed agent route is a declared call with a controller that takes it and answers what it declares, the
 * agent's identity never travels in a call, and a command that only reads makes no write (doc 50 revision 3, Books
 * B, G and H). Each check also fails on a case planted for it.
 */
#[TimeLimit(seconds: 15, reason: 'It reads every call, controller and command of Core and the domains.')]
final class SignedCallRulesTest extends TestCase
{
    /**
     * The folders that may name an agent or a session in their own calls, where the agent itself is the subject.
     */
    private const array AGENT_FOLDERS = ['App\\Agents\\', 'App\\Hooks\\'];

    public function test_every_agent_route_is_a_declared_call(): void
    {
        $this->assertSame([], self::routesOutsideCalls(Routes::getRoutes()->getRoutes()));
    }

    public function test_a_route_registered_by_hand_is_found(): void
    {
        $route = Routes::middleware('journal.agent')->post('agent/planted', PlantedController::class);

        $this->assertSame(['agent/planted'], self::routesOutsideCalls([$route]));
    }

    public function test_every_signed_controller_takes_its_call_and_answers_what_it_declares(): void
    {
        $this->assertSame([], SignedCallRules::controllersNotTakingTheirCall(self::signedControllers()));
        $this->assertNotSame([], SignedCallRules::controllersNotTakingTheirCall([PlantedController::class]));
    }

    public function test_every_call_implements_the_answer_its_endpoint_declares(): void
    {
        $this->assertSame([], SignedCallRules::callsAnsweringOtherThanTheyImplement(self::calls()));
        $this->assertSame(
            [PlantedRetireCall::class],
            SignedCallRules::callsAnsweringOtherThanTheyImplement([PlantedRetireCall::class]),
        );
    }

    public function test_no_call_names_an_agent_a_session_or_a_user_outside_the_agents_own_code(): void
    {
        $outside = array_values(array_filter(
            self::calls(),
            fn (string $call): bool => ! array_any(
                self::AGENT_FOLDERS,
                fn (string $folder) => str_starts_with($call, $folder),
            ),
        ));

        $this->assertSame([], SignedCallRules::actorIdProperties($outside));
        $this->assertNotSame([], SignedCallRules::actorIdProperties([PlantedRetireCall::class]));
    }

    public function test_a_command_that_only_reads_makes_no_write(): void
    {
        $this->assertSame([], SignedCallRules::writesOfReadCommands(self::readCommands(), self::calls()));
        $this->assertNotSame([], SignedCallRules::writesOfReadCommands(
            ['PlantedCommand' => '$processes->admitLine($line);'],
            self::calls(),
        ));
    }

    public function test_no_code_writes_an_agent_path_outside_the_routes_and_the_sender(): void
    {
        $allowed = ['/Routes/', 'AgentRequests/Support/SendSignedCalls.php', 'Mcp/Servers/JournalServer.php'];
        $found = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode()]) as $file) {
            $writesPath = preg_match('#[\'"]/agent/#', (string) file_get_contents($file)) === 1;

            if ($writesPath && ! array_any($allowed, fn (string $part) => str_contains($file, $part))) {
                $found[] = $file;
            }
        }

        $this->assertSame([], $found);
    }

    /**
     * @param  array<int, Route>  $routes
     * @return list<string>
     */
    private static function routesOutsideCalls(array $routes): array
    {
        $outside = [];
        $mcp = ltrim(JournalServer::PATH, '/');

        foreach ($routes as $route) {
            $signed = in_array('journal.agent', $route->gatherMiddleware(), true);

            if ($signed && $route->uri() !== $mcp && ! array_key_exists(CallRoutes::CALL_DEFAULT, $route->defaults)) {
                $outside[] = $route->uri();
            }
        }

        return $outside;
    }

    /**
     * @return list<class-string>
     */
    private static function signedControllers(): array
    {
        $controllers = [];

        foreach (Routes::getRoutes()->getRoutes() as $route) {
            if (array_key_exists(CallRoutes::CALL_DEFAULT, $route->defaults)) {
                $controllers[] = $route->getControllerClass();
            }
        }

        /** @var list<class-string> $found */
        $found = array_values(array_unique(array_filter($controllers)));

        return $found;
    }

    /**
     * @return list<class-string<JournalCall<Data>>>
     */
    private static function calls(): array
    {
        $calls = [];

        $files = [
            ...glob(app_path('*/Calls/*Call.php')) ?: [],
            ...glob(base_path('domain/*/src/Calls/*Call.php')) ?: [],
        ];

        foreach ($files as $file) {
            $class = self::classOf($file);

            if ($class !== null && is_subclass_of($class, JournalCall::class)) {
                $calls[] = $class;
            }
        }

        return $calls;
    }

    /**
     * The source of every console command that declares it only reads.
     *
     * @return array<string, string>
     */
    private static function readCommands(): array
    {
        $commands = [];

        $files = [
            ...glob(app_path('*/Console/*Command.php')) ?: [],
            ...glob(base_path('domain/*/src/Console/*Command.php')) ?: [],
        ];

        foreach ($files as $file) {
            $class = self::classOf($file);
            $route = $class === null ? [] : new ReflectionClass($class)->getAttributes(JournalRoute::class);

            if ($route !== [] && $route[0]->newInstance()->type === JournalRouteType::Read) {
                $commands[$class] = (string) file_get_contents($file);
            }
        }

        return $commands;
    }

    /**
     * @return class-string|null
     */
    private static function classOf(string $file): string|null
    {
        $source = (string) file_get_contents($file);
        $hasNamespace = preg_match('/^namespace ([^;]+);/m', $source, $namespace) === 1;
        $hasClass = preg_match('/^(?:final |abstract )?(?:readonly )?class (\w+)/m', $source, $name) === 1;

        if (! $hasNamespace || ! $hasClass) {
            return null;
        }

        /** @var class-string $class */
        $class = $namespace[1].'\\'.$name[1];

        return class_exists($class) ? $class : null;
    }
}
