<?php

declare(strict_types=1);

namespace App\Mcp\Resources;

use App\CommandRules\Mcp\Contracts\McpCall;
use App\Mcp\Exceptions\ResourceMimeTypeRefused;
use Laravel\Mcp\Request;
use Laravel\Mcp\Response;
use Laravel\Mcp\Server\Resource;

/**
 * The base of every journal resource: JSON or Markdown only, and a refused read answered as a JSON-RPC error.
 */
abstract class JournalResource extends Resource
{
    private const array MIME_TYPES = [
        'application/json',
        'text/markdown',
    ];

    /**
     * @throws ResourceMimeTypeRefused
     */
    final public function mimeType(): string
    {
        $mimeType = parent::mimeType();

        if (! in_array($mimeType, self::MIME_TYPES, true)) {
            throw ResourceMimeTypeRefused::for(static::class, $mimeType);
        }

        return $mimeType;
    }

    /**
     * Answers the request for the resource through the call, so its reply is recorded and repeated.
     */
    final public function handle(Request $request, McpCall $call): Response
    {
        return $call->answerResource($this->uri(), fn () => $this->read($request));
    }

    /**
     * The resource's content for the request.
     */
    abstract protected function read(Request $request): Response;
}
