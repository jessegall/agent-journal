<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Recordings\RecordedCall;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Route;
use PHPUnit\Framework\TestCase;

/**
 * A recorded call keeps the headers a client reads and never a signature or a credential, cuts a body past its limit
 * and says so, and keeps of a private value's answer only that a value was sent.
 */
final class RecordedCallTest extends TestCase
{
    public function test_a_signature_or_credential_header_is_never_kept(): void
    {
        $request = Request::create('/host/heartbeat', 'POST', server: [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => 'Bearer secret',
            'HTTP_X_JOURNAL_SIGNATURE' => 'signed',
        ], content: '{"live_processes":[]}');

        $call = RecordedCall::askedBy($request);

        $this->assertSame(
            [['Content-Type' => 'application/json', 'Accept' => 'application/json'], '{"live_processes":[]}', false],
            [$call->headers, $call->body, $call->isCut],
        );
    }

    public function test_a_body_past_the_limit_is_cut_and_says_so(): void
    {
        $request = Request::create('/host/inventory', 'POST', content: str_repeat('a', 70000));

        $call = RecordedCall::askedBy($request);

        $this->assertSame([RecordedCall::BODY_BYTE_LIMIT, true], [strlen($call->body), $call->isCut]);
    }

    public function test_a_private_values_answer_keeps_only_that_a_value_was_sent(): void
    {
        $request = Request::create('/host/private-values/s-1', 'POST');
        $request->setRouteResolver(fn () => new Route('POST', 'host/private-values/{submission}', [])
            ->name('agents.host.private-values.pull'));

        $call = RecordedCall::answeredWith(new Response('{"value":"hunter2"}', 200), $request);

        $this->assertSame([200, '', true], [$call->status, $call->body, $call->isWithheld]);
    }
}
