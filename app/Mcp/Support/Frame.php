<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use Carbon\CarbonImmutable;
use Laravel\Mcp\Enums\MetaKey;
use Laravel\Mcp\Enums\RequestHeader;
use Laravel\Mcp\Transport\JsonRpcRequest;

/**
 * One JSON-RPC message a launched program wrote, as the exact bytes it wrote, with the moment the relay admitted it.
 * Its deadline is 20 seconds after admission.
 */
final readonly class Frame
{
    public const int BUDGET_SECONDS = 20;

    /**
     * Below this many seconds left, a queued frame is not started.
     */
    public const int SMALLEST_START_SECONDS = 2;

    private const string CANCELLED = 'notifications/cancelled';

    private const string INITIALIZE = 'initialize';

    /**
     * @param  array<string, mixed>  $message
     */
    public function __construct(
        public string $bytes,
        public array $message,
        public CarbonImmutable $admittedAt,
    ) {}

    public function id(): int|string|null
    {
        $id = $this->message['id'] ?? null;

        return is_int($id) || is_string($id) ? $id : null;
    }

    public function method(): string|null
    {
        $method = $this->message['method'] ?? null;

        return is_string($method) ? $method : null;
    }

    /**
     * Whether the program waits for an answer to this frame: a request, with an id and a method.
     */
    public function expectsAnswer(): bool
    {
        return $this->id() !== null && $this->method() !== null;
    }

    /**
     * The id of the request a notifications/cancelled frame cancels, when this is one.
     */
    public function cancelledId(): int|string|null
    {
        $requestId = $this->params()['requestId'] ?? null;

        return $this->method() === self::CANCELLED && (is_int($requestId) || is_string($requestId)) ? $requestId : null;
    }

    public function isLegacyInitialize(): bool
    {
        return $this->method() === self::INITIALIZE && $this->protocolVersion() === null;
    }

    public function deadline(): CarbonImmutable
    {
        return $this->admittedAt->addSeconds(self::BUDGET_SECONDS);
    }

    public function canStartAt(CarbonImmutable $now): bool
    {
        return $now->diffInSeconds($this->deadline(), false) >= self::SMALLEST_START_SECONDS;
    }

    /**
     * The MCP headers of the frame's call: a modern frame mirrors its method, name and protocol version; a legacy
     * frame carries the version its initialize negotiated, once there is one.
     *
     * @return array<string, string>
     */
    public function mcpHeaders(string|null $negotiatedVersion): array
    {
        $version = $this->protocolVersion();

        if ($version !== null && $this->method() !== null) {
            $request = new JsonRpcRequest($this->id() ?? 0, $this->method(), $this->params());

            return [...$request->mirroredHeaders(), RequestHeader::PROTOCOL_VERSION->value => $version];
        }

        return $negotiatedVersion === null ? [] : [RequestHeader::PROTOCOL_VERSION->value => $negotiatedVersion];
    }

    /**
     * The per-request protocol version a modern frame names in its _meta, or null for a legacy frame.
     */
    private function protocolVersion(): string|null
    {
        $meta = $this->params()['_meta'] ?? null;
        $version = is_array($meta) ? ($meta[MetaKey::PROTOCOL_VERSION->value] ?? null) : null;

        return is_string($version) ? $version : null;
    }

    /**
     * @return array<string, mixed>
     */
    private function params(): array
    {
        $params = $this->message['params'] ?? [];

        return is_array($params) ? $params : [];
    }
}
