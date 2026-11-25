<?php

declare(strict_types=1);

namespace Tests\Support\Seeding;

use App\Contracts\Actors\CurrentActorSetter;
use App\Support\AgentContext;
use App\Support\EnrolledHost;
use App\Support\SignedCall;
use Carbon\CarbonImmutable;
use Closure;
use Illuminate\Contracts\Auth\Factory as AuthFactory;
use Illuminate\Http\Response;
use Illuminate\Support\Str;
use Illuminate\Testing\TestResponse;

/**
 * How the journal fixture reaches the journal over HTTP: a named web route as the signed-in user or a guest, a call an
 * agent's start signs or a call a host signs. Each request starts with nothing bound but who it signs in as, and puts
 * the selection in place back afterwards.
 */
trait SendsRequests
{
    private const string MCP_ROUTE = '/agent/mcp/v1';

    /**
     * The named route as the user in place, or as a guest after asGuest(), with the payload as form data.
     *
     * @param  array<string, mixed>  $parameters
     * @param  array<string, mixed>  $query
     * @param  array<string, mixed>  $payload
     * @param  array<string, string>  $headers
     * @return TestResponse<Response>
     */
    public function route(
        string $method,
        string $name,
        array $parameters = [],
        array $query = [],
        array $payload = [],
        array $headers = [],
    ): TestResponse {
        $uri = self::uriOf($name, $parameters, $query);

        return $this->sendAsUser(fn () => $this->test->call($method, $uri, $payload, server: self::serverOf($headers)));
    }

    /**
     * The named route as the user in place, or as a guest, with the payload as JSON.
     *
     * @param  array<string, mixed>  $parameters
     * @param  array<string, mixed>  $query
     * @param  array<string, mixed>  $payload
     * @param  array<string, string>  $headers
     * @return TestResponse<Response>
     */
    public function jsonRoute(
        string $method,
        string $name,
        array $parameters = [],
        array $query = [],
        array $payload = [],
        array $headers = [],
    ): TestResponse {
        $uri = self::uriOf($name, $parameters, $query);

        return $this->sendAsUser(fn () => $this->test->json($method, $uri, $payload, $headers));
    }

    /**
     * A call the named start signs with the credential it was issued, over exactly this method, target and body.
     *
     * @param  array<string, mixed>|string|null  $body  an array is sent as JSON, a string as it is
     * @param  array<string, string>  $headers  more request headers, by their server key, over the signed ones
     * @return TestResponse<Response>
     */
    public function agentCall(
        string $start,
        string $method,
        string $target,
        array|string|null $body = null,
        string|null $callId = null,
        CarbonImmutable|null $issuedAt = null,
        array $headers = [],
    ): TestResponse {
        $content = self::contentOf($body);
        $signed = $this->testStartCalled($start)->serverHeaders(
            $content,
            $callId ?? 'call-'.bin2hex(random_bytes(4)),
            ($issuedAt ?? CarbonImmutable::now())->getTimestamp(),
            method: $method,
            target: $target,
        );

        $server = [...$signed, ...$headers];

        return $this->sendSigned(fn () => $this->test->call($method, $target, server: $server, content: $content));
    }

    /**
     * A tools/call frame for the tool, signed by the named start, under its own JSON-RPC id.
     *
     * @param  array<string, mixed>  $arguments
     * @param  array<string, string>  $headers
     * @return TestResponse<Response>
     */
    public function mcpTool(
        string $start,
        string $tool,
        array $arguments = [],
        int|string $rpcId = 1,
        string|null $callId = null,
        array $headers = [],
    ): TestResponse {
        $frame = json_encode([
            'jsonrpc' => '2.0',
            'id' => $rpcId,
            'method' => 'tools/call',
            'params' => ['name' => $tool, 'arguments' => (object) $arguments],
        ], JSON_THROW_ON_ERROR);

        return $this->mcpFrame($start, $frame, $headers, callId: $callId);
    }

    /**
     * Any frame to the MCP route as it is written, signed by the named start: discovery, resources or a frame of its
     * own id.
     *
     * @param  array<string, string>  $headers
     * @return TestResponse<Response>
     */
    public function mcpFrame(
        string $start,
        string $frame,
        array $headers = [],
        CarbonImmutable|null $issuedAt = null,
        string|null $callId = null,
    ): TestResponse {
        return $this->agentCall($start, 'POST', self::MCP_ROUTE, $frame, $callId, $issuedAt, $headers);
    }

    /**
     * A call the host signs with its secret, over exactly this method, target and body.
     *
     * @param  array<string, mixed>|string|null  $body  an array is sent as JSON, a string as it is
     * @param  array<string, string>  $headers  more request headers, by their server key, such as the failed calls a
     *                                          host reports
     * @return TestResponse<Response>
     */
    public function hostCall(
        EnrolledHost $host,
        string $method,
        string $target,
        array|string|null $body = null,
        string|null $callId = null,
        CarbonImmutable|null $issuedAt = null,
        array $headers = [],
    ): TestResponse {
        $content = self::contentOf($body);
        $callId ??= (string) Str::uuid();
        $time = ($issuedAt ?? CarbonImmutable::now())->getTimestamp();
        $signature = SignedCall::signatureFor($host->secret, $method, $target, $callId, $time, $content);
        $server = [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_ACCEPT' => 'application/json',
            'HTTP_AUTHORIZATION' => "Bearer {$host->secret}",
            self::serverKey(SignedCall::ID_HEADER) => $callId,
            self::serverKey(SignedCall::ISSUED_AT_HEADER) => (string) $time,
            self::serverKey(SignedCall::SIGNATURE_HEADER) => $signature,
            ...$headers,
        ];

        return $this->sendSigned(fn () => $this->test->call($method, $target, server: $server, content: $content));
    }

    /**
     * Sends with only the signed-in user of the selection in place: no agent, no actor and no scoped binding.
     *
     * @param  Closure(): TestResponse<Response>  $send
     * @return TestResponse<Response>
     */
    private function sendAsUser(Closure $send): TestResponse
    {
        $this->app->forgetScopedInstances();
        $this->app->forgetInstance(AgentContext::class);
        $this->app->make(CurrentActorSetter::class)->clear();

        try {
            return $send();
        } finally {
            $this->requests->reselect();
        }
    }

    /**
     * Sends a signed call with nothing in place at all, so only the signature can say who calls.
     *
     * @param  Closure(): TestResponse<Response>  $send
     * @return TestResponse<Response>
     */
    private function sendSigned(Closure $send): TestResponse
    {
        return $this->sendAsUser(function () use ($send): TestResponse {
            $this->app->make(AuthFactory::class)->guard()->forgetUser();

            return $send();
        });
    }

    /**
     * @param  array<string, mixed>  $parameters
     * @param  array<string, mixed>  $query
     */
    private static function uriOf(string $name, array $parameters, array $query): string
    {
        $uri = route($name, $parameters, absolute: false);

        return $query === [] ? $uri : $uri.'?'.http_build_query($query);
    }

    /**
     * @param  array<string, mixed>|string|null  $body
     */
    private static function contentOf(array|string|null $body): string
    {
        return match (true) {
            $body === null => '',
            is_string($body) => $body,
            default => json_encode((object) $body, JSON_THROW_ON_ERROR),
        };
    }

    /**
     * @param  array<string, string>  $headers
     * @return array<string, string>
     */
    private static function serverOf(array $headers): array
    {
        $server = [];

        foreach ($headers as $name => $value) {
            $server[self::serverKey($name)] = $value;
        }

        return $server;
    }

    private static function serverKey(string $header): string
    {
        $key = strtoupper(str_replace('-', '_', $header));

        return in_array($key, ['CONTENT_TYPE', 'CONTENT_LENGTH'], true) ? $key : "HTTP_{$key}";
    }
}
