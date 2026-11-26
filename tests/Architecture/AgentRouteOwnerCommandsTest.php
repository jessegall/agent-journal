<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Access\Contracts\OwnerPolicy;
use App\Http\Middleware\Agents\AuthenticateAgent;
use App\Support\CommandRegistry;
use App\Support\Reflector;
use Illuminate\Routing\Route;
use Illuminate\Routing\Router;
use Tests\Support\Entries\DeclaredCommands;
use Tests\TestCase;

/**
 * No agent route sends a command under an owner policy: no profile grants an agent any of it, so such a route could
 * only ever refuse. The owner reaches those commands from its pages.
 */
final class AgentRouteOwnerCommandsTest extends TestCase
{
    public function test_no_agent_route_sends_an_owner_command(): void
    {
        $this->assertSame([], $this->ownerCommandsOfAgentRoutes());
    }

    /**
     * Each agent route that sends an owner command, with the command.
     *
     * @return list<string>
     */
    private function ownerCommandsOfAgentRoutes(): array
    {
        $router = $this->app->make(Router::class);
        $registry = $this->app->make(CommandRegistry::class);
        $found = [];

        foreach ($router->getRoutes()->getRoutes() as $route) {
            if (! $this->isAgentRoute($router, $route)) {
                continue;
            }

            foreach (DeclaredCommands::ofRoute($route) as $command) {
                $authorize = $registry->authorizeOf($command);

                if ($authorize !== null && Reflector::factory()->is($authorize->policy, OwnerPolicy::class)) {
                    $found[] = "{$route->getName()} sends {$command}";
                }
            }
        }

        return $found;
    }

    private function isAgentRoute(Router $router, Route $route): bool
    {
        return in_array(AuthenticateAgent::class, $router->gatherRouteMiddleware($route), true);
    }
}
