<?php

declare(strict_types=1);

namespace Tests\Feature\Profiles;

use App\Enums\Projects\ArrangementType;
use App\Support\SignedCall;
use App\Support\SignedSignInHost;
use Illuminate\Http\Client\Factory;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

/**
 * The sign-in runner is a host of the journal: every call it makes is signed with its call id, issue time and
 * signature.
 */
final class SignedSignInHostTest extends TestCase
{
    public function test_each_call_of_the_sign_in_runner_is_signed(): void
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
        Http::assertNotSent(fn (Request $request) => ! $request->hasHeader(SignedCall::ID_HEADER)
            || ! $request->hasHeader(SignedCall::ISSUED_AT_HEADER)
            || ! $request->hasHeader(SignedCall::SIGNATURE_HEADER));
    }
}
