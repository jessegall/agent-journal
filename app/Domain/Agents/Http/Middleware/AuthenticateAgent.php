<?php

declare(strict_types=1);

namespace App\Domain\Agents\Http\Middleware;

use App\Domain\Agents\AgentContext;
use App\Domain\Agents\AgentContextFactory;
use App\Domain\Agents\CallSignatureInvalid;
use App\Domain\Agents\CredentialRejected;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Authenticates an agent request by its launch credential and signed call, and makes its context the one for this request.
 */
final readonly class AuthenticateAgent
{
    public function __construct(
        private AgentContextFactory $contexts,
        private Container $container,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            $context = $this->contexts->fromRequest($request);
        } catch (CredentialRejected|CallSignatureInvalid $rejection) {
            return new JsonResponse(['message' => $rejection->getMessage()], Response::HTTP_UNAUTHORIZED);
        }

        $this->container->instance(AgentContext::class, $context);

        return $next($request);
    }
}
