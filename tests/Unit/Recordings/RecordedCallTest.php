<?php

declare(strict_types=1);

namespace Tests\Unit\Recordings;

use App\Support\Recordings\MultiplexedStream;
use App\Support\Recordings\RecordedCall;
use App\Support\Recordings\RecordingFakes;
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

    public function test_a_multiplexed_body_is_faked_frame_by_frame_with_each_length_written_anew(): void
    {
        $lines = ["{\"configDirectory\": \"/Users/someone/.account\"\n", "}\n"];
        $body = implode('', array_map(fn (string $line) => "\1\0\0\0".pack('N', strlen($line)).$line, $lines));
        $request = Request::create('/v1.51/containers/journal-process-1/logs');
        $answer = new Response($body, 200, ['Content-Type' => MultiplexedStream::CONTENT_TYPE]);

        $faked = RecordedCall::answeredWith($answer, $request)->fakedBy(new RecordingFakes([], []));

        $firstLength = unpack('Nlength', $faked->body, 4)['length'];
        $second = 8 + $firstLength;
        $secondLength = unpack('Nlength', $faked->body, $second + 4)['length'];
        $json = substr($faked->body, 8, $firstLength).substr($faked->body, $second + 8, $secondLength);
        $fields = json_decode($json, true, flags: JSON_THROW_ON_ERROR);

        $this->assertSame(RecordingFakes::USER_FOLDER.'/.account', $fields['configDirectory']);
        $this->assertSame(2, $secondLength);
        $this->assertSame(strlen($faked->body), $second + 8 + $secondLength);
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
