<?php

declare(strict_types=1);

namespace App\Http\Middleware\Agents;

use App\Commands\Projects\RecordHostCallAnswered\RecordHostCallAnsweredCommand;
use App\Commands\Projects\RecordHostCallFailure\RecordHostCallFailureCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Hosts\HostCalls;
use App\Contracts\Hosts\LocalProjectHosts;
use App\Data\Hosts\FailedHostCallData;
use App\Enums\Accounts\CommandEntry;
use App\Enums\Projects\HostRouteRole;
use App\Exceptions\CallSignatureInvalid;
use App\Exceptions\HostCredentialRejected;
use App\Exceptions\HostRoleRefused;
use App\Models\Projects\Host;
use App\Support\ActorStore;
use App\Support\Command;
use App\Support\CommandEntrance;
use App\Values\HostContext;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as IlluminateResponse;
use Spatie\LaravelData\DataCollection;
use Symfony\Component\HttpFoundation\Response;

/**
 * Admits a signed host call (SignedHostCalls) from the hosts the route's role names: enrolled hosts by default,
 * journal.host:relay for a connected folder's own routes, journal.host:shared for the work routes both use, where a
 * relay must have a live binding and is scoped to it. The host is bound for this request only (Octane), never kept on
 * a singleton. Each answered call is kept on the host for its link alarm: a server error, or an answer after failures.
 */
final readonly class AuthenticateHost
{
    /**
     * The header a host sends the calls that failed on its side in, on its next call the journal answers.
     */
    private const string FAILED_CALLS_HEADER = 'X-Journal-Failed-Calls';

    /**
     * The most failed calls of one report that are kept, as the host keeps no more.
     */
    private const int FAILED_CALL_LIMIT = 20;

    public function __construct(
        private Container $container,
        private HostCalls $calls,
        private LocalProjectHosts $localHosts,
        private ActorStore $actors,
        private CommandEntrance $entrance,
        private CommandBus $commands,
    ) {}

    /**
     * @param  Closure(Request): Response  $next
     * @param  string  $role  the hosts the route admits, journal.host:relay or journal.host:shared; none admits
     *                        enrolled hosts
     */
    public function handle(Request $request, Closure $next, string $role = HostRouteRole::Enrolled->value): Response
    {
        try {
            $context = $this->servingContext($this->calls->verify($request), HostRouteRole::from($role));
        } catch (HostCredentialRejected|CallSignatureInvalid $rejection) {
            return new JsonResponse(['message' => $rejection->getMessage()], Response::HTTP_UNAUTHORIZED);
        } catch (HostRoleRefused $refusal) {
            return new JsonResponse(['message' => $refusal->getMessage()], Response::HTTP_FORBIDDEN);
        }

        $this->container->instance(HostContext::class, $context);

        try {
            $handle = fn (): Response => $next($request);
            $response = $this->entrance->through(
                CommandEntry::HostControl,
                fn (): Response => $this->actors->actAsSystem('host request', $handle),
            );
        } finally {
            $this->container->forgetInstance(HostContext::class);
        }

        $this->recordCallOutcome($context->hostId, $request, $response);

        return $response;
    }

    /**
     * Keeps a server error the call was answered with, or that it was answered when that ends a failure, carries the
     * host's own report of failed calls, or follows a minute of quiet.
     */
    private function recordCallOutcome(string $hostId, Request $request, Response $response): void
    {
        $route = '/'.$request->path();

        if ($response->getStatusCode() >= Response::HTTP_INTERNAL_SERVER_ERROR) {
            $this->runForHost(
                new RecordHostCallFailureCommand(
                    $hostId,
                    $route,
                    $response->getStatusCode(),
                    $this->reasonOf($response),
                ),
            );

            return;
        }

        $reported = $this->reportedFailures($request);

        if (Host::query()->findOrFail($hostId)->hasAnswerToRecord($route, $reported, CarbonImmutable::now())) {
            $this->runForHost(new RecordHostCallAnsweredCommand($hostId, $route, $reported));
        }
    }

    /**
     * @param  Command<void>  $command
     */
    private function runForHost(Command $command): void
    {
        $this->entrance->through(
            CommandEntry::HostControl,
            fn () => $this->actors->actAsSystem('host request', fn () => $this->commands->run($command)),
        );
    }

    /**
     * Why the journal failed the call: the exception it answered with, else the status's own name.
     */
    private function reasonOf(Response $response): string
    {
        $exception = $response instanceof IlluminateResponse
            || $response instanceof JsonResponse
            ? $response->exception
            : null;
        $reason = $exception?->getMessage() ?? Response::$statusTexts[$response->getStatusCode()] ?? 'Server error';

        return mb_substr($reason, 0, 300);
    }

    /**
     * The calls the host reports failed on its side, as the host's client sends them, at most its limit of them.
     *
     * @return list<FailedHostCallData>
     */
    private function reportedFailures(Request $request): array
    {
        $header = $request->header(self::FAILED_CALLS_HEADER);

        if (! is_string($header)) {
            return [];
        }

        $calls = FailedHostCallData::collect(
            json_decode($header, true, flags: JSON_THROW_ON_ERROR),
            DataCollection::class,
        );

        return array_values(array_slice($calls->items(), 0, self::FAILED_CALL_LIMIT));
    }

    /**
     * The call as the route admits it: an enrolled host as it is, a relay only where the route admits relays, and on a
     * route both share only as the relay of its live binding.
     *
     * @throws HostRoleRefused
     */
    private function servingContext(HostContext $context, HostRouteRole $role): HostContext
    {
        if (! Host::query()->findOrFail($context->hostId)->isConnectedFolderRelay()) {
            if ($role->isForEnrolledHosts()) {
                return $context;
            }

            throw HostRoleRefused::forRelayOnly($context->hostId);
        }

        if (! $role->isForRelays()) {
            throw HostRoleRefused::forEnrolledOnly($context->hostId);
        }

        if (! $role->isForEnrolledHosts()) {
            return $context;
        }

        foreach ($this->localHosts->liveBindingOf($context->hostId) as $bindingId) {
            return $context->servingBinding($bindingId);
        }

        throw HostRoleRefused::forNoLiveBinding($context->hostId);
    }
}
