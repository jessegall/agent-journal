<?php

declare(strict_types=1);

namespace Tests\Support\Entries;

use App\Hosts\EnrolledHost;
use App\Http\Controllers\Web\PageController;
use App\Support\ClientDeclarations;
use App\Support\Reflector;
use App\Web\DeclaredRouteKey;
use Illuminate\Http\Request;
use Illuminate\Routing\Route;
use Illuminate\Routing\Router;
use Illuminate\Testing\TestResponse;
use Inertia\Testing\AssertableInertia;
use Symfony\Component\HttpFoundation\Response;
use Tests\Fixtures\Agents\TestStart;
use Tests\Support\CommitsHookRows;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\Support\Seeding\TestJournal;
use Tests\TestCase;

/**
 * The entry test of one route method, named by the class's #[TestsRoute]: the arranged call reaches the route as its
 * caller, answers with a success or a redirect, and sends on exactly the commands expected, each one the action
 * declares with #[Dispatches] and each through every middleware; a page also renders its declared component.
 */
abstract class RouteEntryTestCase extends TestCase
{
    use CommitsHookRows;

    /**
     * None by name: the commands of the test commit, as a repeatable read one must, and what the test wrote is emptied
     * when it ends.
     */
    protected const array TABLES = [];

    abstract protected function arrange(TestJournal $journal): RouteCall;

    public function test_the_request_is_reached_and_dispatches_what_it_declares(): void
    {
        $this->assertReachedAndDispatchesItsCommands($this->arrangedCall());
    }

    /**
     * Sends the call as its caller: the answer is no error, the commands it sends are the declared ones and exactly
     * those it expects, and a page renders its declared component; a test of a second case of the route sends its own.
     */
    protected function assertReachedAndDispatchesItsCommands(RouteCall $call): void
    {
        $this->journal->sinkCommands()->sinkReplies($call->replies);

        $response = $this->send($call, $call->caller);

        $this->assertLessThan(400, $response->getStatusCode(), (string) $response->getContent());

        if ($call->answer !== []) {
            $response->assertJson($call->answer);
        }
        $this->journal->assertDispatchedOnlyDeclared(
            DeclaredCommands::ofRoute($this->route()),
            (string) $this->route()->getControllerClass(),
        )
            ->assertDispatchedExactly($call->expected);
        $this->assertRendersItsPage($response);
    }

    /**
     * The arranged call, checked against the caller the route's middleware lets in.
     */
    protected function arrangedCall(): RouteCall
    {
        $call = $this->arrange($this->journal);
        $answers = Caller::of($this->route()->gatherMiddleware());

        $this->assertSame(
            $answers,
            $call->caller,
            "{$this->entry()->entryName()} answers a {$answers->value} caller: arrange the call as one.",
        );

        if ($call->caller === Caller::Agent) {
            $this->journal->heartbeatOf($this->startOf($call));
        }

        if ($call->caller === Caller::SharedHost || $call->caller === Caller::RelayHost) {
            $this->journal->markHostAnswered($this->hostOf($call));
        }

        return $call;
    }

    /**
     * Sends the call's method, address and payload as the caller, with the request verb of the test journal that
     * signs as that caller.
     *
     * @return TestResponse<Response>
     */
    protected function send(RouteCall $call, Caller $caller): TestResponse
    {
        $method = $this->entry()->method;
        [$parameters, $query] = $this->addressOf($call);
        $name = $this->entry()->name;
        $target = $this->targetOf($call);

        return match ($caller) {
            Caller::Agent => $this->journal->agentCall(
                $this->startOf($call),
                $method,
                $target,
                $call->payload,
                headers: $call->headers,
            ),
            Caller::SharedHost, Caller::RelayHost => $this->journal->hostCall(
                $this->hostOf($call),
                $method,
                $target,
                $call->payload,
                headers: $call->headers,
            ),
            Caller::DeviceGrant => $this->json(
                $method,
                $target,
                $call->payload,
                [...$call->headers, 'Authorization' => "Bearer {$call->signer}"],
            ),
            Caller::Public => $this->sendPublic($call, $parameters, $query),
            Caller::Guest, Caller::User => $this->journal->jsonRoute(
                $method,
                $name,
                $parameters,
                $query,
                $call->payload,
                $call->headers,
            ),
        };
    }

    /**
     * A public call: signed by the host it names when its controller verifies the host itself, else sent as it is.
     *
     * @param  array<string, mixed>  $parameters
     * @param  array<string, mixed>  $query
     * @return TestResponse<Response>
     */
    private function sendPublic(RouteCall $call, array $parameters, array $query): TestResponse
    {
        if ($call->signer instanceof EnrolledHost) {
            return $this->journal->hostCall(
                $call->signer,
                $this->entry()->method,
                $this->targetOf($call),
                $call->payload,
                headers: $call->headers,
            );
        }

        return $this->journal->jsonRoute(
            $this->entry()->method,
            $this->entry()->name,
            $parameters,
            $query,
            $call->payload,
            $call->headers,
        );
    }

    /**
     * The address the call goes to: the route with its parameters and query.
     */
    protected function targetOf(RouteCall $call): string
    {
        [$parameters, $query] = $this->addressOf($call);

        return route($this->entry()->name, [...$parameters, ...$query], false);
    }

    protected function route(): Route
    {
        $route = $this->app->make(Router::class)->getRoutes()->getByName($this->entry()->name);
        $this->assertNotNull($route, "No route is named {$this->entry()->name}.");

        return $route;
    }

    protected function entry(): TestsRoute
    {
        return Reflector::of($this)->attribute(TestsRoute::class);
    }

    /**
     * The route's parameters and query: those the call names, or those a recorded page request's address holds, which
     * must be an address of this route.
     *
     * @return array{array<string, mixed>, array<string, mixed>}
     */
    private function addressOf(RouteCall $call): array
    {
        if ($call->recordedAddress === null) {
            return [$call->parameters, $call->query];
        }

        $request = Request::create($call->recordedAddress, $this->entry()->method);
        $matched = $this->app->make(Router::class)->getRoutes()->match($request);
        $this->assertSame($this->entry()->name, $matched->getName(), "{$call->recordedAddress} is not this route.");

        // The address's own parameters only: a route's defaults, such as its declaration, are not part of it.
        $parameters = array_intersect_key($matched->parameters(), array_flip($matched->parameterNames()));

        return [$parameters, $request->query->all()];
    }

    private function startOf(RouteCall $call): TestStart|string
    {
        $this->assertNotInstanceOf(EnrolledHost::class, $call->signer, 'An agent call is signed by a start.');
        $this->assertNotNull($call->signer, 'An agent call is signed by a start: name it in RouteCall::as.');

        return $call->signer;
    }

    private function hostOf(RouteCall $call): EnrolledHost
    {
        $this->assertInstanceOf(EnrolledHost::class, $call->signer, 'A host call is signed by the host it names.');

        return $call->signer;
    }

    /**
     * @param  TestResponse<Response>  $response
     */
    private function assertRendersItsPage(TestResponse $response): void
    {
        $route = $this->route();

        if ($this->entry()->method !== 'GET' || $route->getControllerClass() !== PageController::class) {
            return;
        }

        $component = $this->app->make(ClientDeclarations::class)->page(DeclaredRouteKey::of($route))->componentName();
        $response->assertInertia(fn (AssertableInertia $page) => $page->component($component, false));
    }
}
