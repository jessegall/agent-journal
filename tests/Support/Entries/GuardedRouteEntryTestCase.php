<?php

declare(strict_types=1);

namespace Tests\Support\Entries;

use App\Support\EnrolledHost;
use Illuminate\Testing\TestResponse;
use PhpOption\None;
use PhpOption\Option;
use PhpOption\Some;
use Symfony\Component\HttpFoundation\Response;

/**
 * The entry test of a route only some callers reach: beside the reach test, the same call from the caller the route
 * refuses is turned away and sends on nothing, and so is a user the page is hidden from, when the arrangement names
 * one.
 */
abstract class GuardedRouteEntryTestCase extends RouteEntryTestCase
{
    public function test_a_caller_without_access_is_refused_and_nothing_is_dispatched(): void
    {
        $call = $this->arrangedCall();
        $stranger = $this->strangerOf($call);
        $this->journal->sinkCommands()->sinkReplies($call->replies);

        $this->assertRefused($this->sendAsRefused($call, $stranger));
        $this->journal->assertNothingDispatched();

        if ($call->hiddenFrom !== null) {
            $this->journal->actAs($call->hiddenFrom);
            $this->assertRefused($this->send($call, Caller::User));
            $this->journal->assertNothingDispatched();
        }
    }

    /**
     * The enrolled host a relay's route refuses, enrolled and answered before anything is sunk; none for another caller.
     *
     * @return Option<EnrolledHost>
     */
    private function strangerOf(RouteCall $call): Option
    {
        if ($call->caller !== Caller::RelayHost) {
            return None::create();
        }

        $host = $this->journal->enrolledHost();
        $this->journal->markHostAnswered($host);

        return new Some($host);
    }

    /**
     * The call as the route's refused caller: a guest for a user's route, an unsigned call for an agent's or a host's,
     * an enrolled host's signature for a relay's, no grant for a device's, and a signed-in user for a guest's.
     *
     * @param  Option<EnrolledHost>  $stranger
     * @return TestResponse<Response>
     */
    private function sendAsRefused(RouteCall $call, Option $stranger): TestResponse
    {
        $method = $this->entry()->method;
        $target = $this->targetOf($call);

        return match ($call->caller) {
            Caller::User => $this->sendAsGuest($call),
            Caller::Agent, Caller::SharedHost, Caller::DeviceGrant => $this->json(
                $method,
                $target,
                $call->payload,
            ),
            Caller::RelayHost => $this->journal->hostCall(
                $stranger->get(),
                $method,
                $target,
                $call->payload,
            ),
            Caller::Guest => $this->sendAsOwner($call),
            Caller::Public => $this->fail('A public route has no refused caller: base its test on RouteEntryTestCase.'),
        };
    }

    /**
     * @return TestResponse<Response>
     */
    private function sendAsGuest(RouteCall $call): TestResponse
    {
        $this->journal->asGuest();

        return $this->send($call, Caller::Guest);
    }

    /**
     * @return TestResponse<Response>
     */
    private function sendAsOwner(RouteCall $call): TestResponse
    {
        $this->journal->owner();

        return $this->send($call, Caller::User);
    }

    /**
     * A refusal: a 4xx answer, or a redirect away from the route, as a guest sent to sign in gets.
     *
     * @param  TestResponse<Response>  $response
     */
    private function assertRefused(TestResponse $response): void
    {
        $this->assertTrue(
            $response->isRedirect() || $response->isClientError(),
            "{$this->entry()->entryName()} let the refused caller in: {$response->getStatusCode()}.",
        );
    }
}
