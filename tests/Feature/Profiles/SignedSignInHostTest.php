<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Enums\ArrangementType;
use App\Enums\HostProtocolVersion;
use App\Support\SignedCall;
use App\Support\SignedSignInHost;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * The sign-in runner is a host of the journal: every call it signs names the protocol version it speaks.
 */
final class SignedSignInHostTest extends TestCase
{
    public function test_each_call_of_the_sign_in_runner_names_its_protocol_version(): void
    {
        Http::fake(['*' => Http::response(null, 204)]);
        $runner = new SignedSignInHost(
            $this->app->make(Factory::class),
            'http://journal.test',
            'host-secret',
            ArrangementType::Contained,
        );

        $runner->reconcileSignIns([]);
        $runner->claim();

        Http::assertSentCount(2);
        Http::assertSent(fn (Request $request) => $request->header(SignedCall::HOST_PROTOCOL_HEADER)
            === [(string) HostProtocolVersion::current()->value]);
        Http::assertNotSent(fn (Request $request) => ! $request->hasHeader(SignedCall::HOST_PROTOCOL_HEADER));
    }
}
