<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Http\Client\Response;

/**
 * The journal's answer to a prepared call as it came, whatever its status: the status, the headers and the body.
 */
final readonly class AgentCallReply
{
    /**
     * @param  array<string, list<string>>  $headers
     */
    public function __construct(public int $status, public array $headers, public string $body) {}

    /**
     * The reply as the HTTP response carried it.
     */
    public static function of(Response $response): self
    {
        return new self($response->status(), $response->headers(), $response->body());
    }

    public function isSuccessful(): bool
    {
        return $this->status >= 200 && $this->status < 300;
    }
}
