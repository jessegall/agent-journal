<?php

declare(strict_types=1);

namespace Tests\Support;

use App\Commands\EnrollHost\EnrollHostCommand;
use App\Contracts\Bus\Command;
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

    /**
     * A host call carrying the calls the host reports failed on its side, as its client sends them.
     *
     * @param  list<array{route: string, status: int, reason: string, since: string}>  $failedCalls
     */
    private function hostCallReporting(EnrolledHost $host, string $target, array $failedCalls): TestResponse
    {
        return $this->signedHostCall($host, 'POST', $target, '{}', [
            'HTTP_X_JOURNAL_FAILED_CALLS' => json_encode($failedCalls, JSON_THROW_ON_ERROR),
        ]);
    }

    private function hostRead(EnrolledHost $host, string $target): TestResponse
    {
        return $this->signedHostCall($host, 'GET', $target, '');
    }

    /**
     * A signed call from the host.
     */
    /**
     * @param  array<string, string>  $headers  more request headers, by their server key
     */
    private function signedHostCall(
        EnrolledHost $host,
        string $method,
        string $target,
        string $content,
        array $headers = [],
    ): TestResponse {
        $callId = (string) Str::uuid();
        $issuedAt = CarbonImmutable::now()->getTimestamp();
        $this->app->forgetScopedInstances();

        return $this->call($method, $target, server: [
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
            ...$headers,
        ], content: $content);
    }
}
