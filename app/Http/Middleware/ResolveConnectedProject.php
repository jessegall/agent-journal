<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Contracts\Actors\CurrentActor;
use App\Exceptions\BindingRevoked;
use App\Models\Projects\ProjectBinding;
use App\Support\ConnectedProject;
use App\Support\ServedEnvironment;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Makes an authenticated agent call of a connected project serve that project: the agent's binding names the
 * project, and its folder is the only one the call's work may run in. A call of an agent this installation runs for
 * its own project keeps the configured project; an agent of a revoked binding is refused, whatever token it holds.
 * The project comes from the agent AuthenticateAgent made the request's actor, never from the call.
 */
final readonly class ResolveConnectedProject
{
    public function __construct(private CurrentActor $current, private ServedEnvironment $projects) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $agentId = $this->current->actor()->actorId();

        if (ProjectBinding::isMainAgentOfRevokedBinding($agentId)) {
            throw BindingRevoked::forAgent($agentId);
        }

        foreach (ProjectBinding::findForMainAgent($agentId) as $binding) {
            $this->projects->connect(new ConnectedProject($binding->canonical_root, $binding->environment_id));
        }

        return $next($request);
    }
}
