<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Data\JsonRpcMessageData;
use Carbon\CarbonImmutable;
use Laravel\Mcp\Enums\MetaKey;
use Laravel\Mcp\Enums\RequestHeader;
use Laravel\Mcp\Transport\JsonRpcRequest;

/**
 * One JSON-RPC message a started driver wrote, as the exact bytes it wrote, with the moment the relay admitted it.
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

    public function __construct(
        public string $bytes,
        public JsonRpcMessageData $message,
        public CarbonImmutable $admittedAt,
    ) {}

    public function id(): int|string|null
    {
        return $this->message->id;
    }

    public function method(): string|null
    {
        return $this->message->method;
    }

    /**
     * Whether the driver waits for an answer to this frame: a request, with an id and a method.
     */
    public function isRequest(): bool
    {
        return $this->id() !== null && $this->method() !== null;
    }

    /**
     * The id of the request a notifications/cancelled frame cancels, when this is one.
     */
    public function cancelledId(): int|string|null
    {
        if ($this->method() !== self::CANCELLED) {
            return null;
        }

        $requestId = $this->params()['requestId'] ?? null;

        return is_int($requestId) || is_string($requestId) ? $requestId : null;
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
        $method = $this->method();

        if ($version !== null && $method !== null) {
            return [...$this->mirroredHeaders($method), RequestHeader::PROTOCOL_VERSION->value => $version];
        }

        return $negotiatedVersion === null ? [] : [RequestHeader::PROTOCOL_VERSION->value => $negotiatedVersion];
    }

    /**
     * The method and name headers a modern frame mirrors; a notification has no name to mirror.
     *
     * @return array<string, string>
     */
    private function mirroredHeaders(string $method): array
    {
        $id = $this->id();

        return $id === null
            ? [RequestHeader::METHOD->value => $method]
            : new JsonRpcRequest($id, $method, $this->params())->mirroredHeaders();
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
        return $this->message->params;
    }
}
