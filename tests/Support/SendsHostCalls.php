<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Commands\EnrollHost\EnrollHostCommand;
use App\Contracts\Command;
use App\Enums\HostProtocolVersion;
use App\Support\EnrolledHost;
use App\Support\SignedCall;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;

/**
 * A host's signed call in a test, as the Go host makes it: its secret as the bearer and the call signed with it, and
 * a host enrolled to make it; the test class runs trusted commands.
 */
trait SendsHostCalls
{
    /**
     * @template TResult
     *
     * @param  Command<TResult>  $command
     * @return TResult
     */
    abstract private function asSystem(Command $command): mixed;

    private function enrolledHost(): EnrolledHost
    {
        return $this->asSystem(new EnrollHostCommand('test host '.Str::random(6), [base_path()]));
    }

    /**
     * @param  array<string, mixed>|null  $body
     */
    private function hostCall(EnrolledHost $host, string $target, array|null $body = null): TestResponse
    {
        $content = $body === null ? '' : json_encode((object) $body, JSON_THROW_ON_ERROR);

        return $this->signedHostCall($host, 'POST', $target, $content);
    }

    private function hostRead(EnrolledHost $host, string $target): TestResponse
    {
        return $this->signedHostCall($host, 'GET', $target, '');
    }

    /**
     * A signed call speaking the given host protocol version; null sends the call without one.
     */
    private function signedHostCall(
        EnrolledHost $host,
        string $method,
        string $target,
        string $content,
        int|null $protocol = HostProtocolVersion::First->value,
    ): TestResponse {
        $callId = (string) Str::uuid();
        $issuedAt = CarbonImmutable::now()->getTimestamp();
        $this->app->forgetScopedInstances();

        $speaks = $protocol === null
            ? []
            : ['HTTP_'.strtoupper(str_replace('-', '_', SignedCall::HOST_PROTOCOL_HEADER)) => (string) $protocol];

        return $this->call($method, $target, server: [
            ...$speaks,
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => "Bearer {$host->secret}",
            'HTTP_'.strtoupper(str_replace('-', '_', SignedCall::ID_HEADER)) => $callId,
            'HTTP_'.strtoupper(str_replace('-', '_', SignedCall::ISSUED_AT_HEADER)) => (string) $issuedAt,
            'HTTP_'.strtoupper(str_replace('-', '_', SignedCall::SIGNATURE_HEADER)) => SignedCall::signatureFor(
                $host->secret,
                $method,
                $target,
                $callId,
                $issuedAt,
                $content,
            ),
        ], content: $content);
    }
}
