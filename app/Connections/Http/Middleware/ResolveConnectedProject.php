<?php

declare(strict_types=1);

namespace App\Connections\Http\Middleware;

use App\Agents\Support\AgentContext;
use App\Connections\Models\ProjectBinding;
use App\Processes\Support\ConnectedProject;
use App\Processes\Support\ProjectKey;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Makes an authenticated agent call of a connected project serve that project: the agent's binding names the
 * project, and its folder is the only one the call's work may run in. A call of an agent this installation runs for
 * its own project keeps the configured project. The project comes from the authenticated agent, never from the call.
 */
final readonly class ResolveConnectedProject
{
    public function __construct(private Container $container, private ProjectKey $projects) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $this->container->bound(AgentContext::class)) {
            return $next($request);
        }

        $agent = $this->container->make(AgentContext::class);

        foreach (ProjectBinding::ofMainAgent($agent->agentId) as $binding) {
            $this->projects->connect(new ConnectedProject($binding->project->key, $binding->canonical_root));
        }

        return $next($request);
    }
}
