<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Bus\Enums\RefusalCode;
use App\Bus\Values\MappedRefusal;
use App\Text\Support\TextPreview;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;

/**
 * A refused MCP call as its caller reads it: the code and the safe message, cut to fit the 4 KiB of an error result.
 */
final readonly class Refusal
{
    private const int MESSAGE_BYTES = 3072;

    public string $message;

    /**
     * @param  array<string, mixed>  $details
     */
    private function __construct(
        public RefusalCode $code,
        string $message,
        private array $details,
    ) {
        $this->message = TextPreview::within($message, self::MESSAGE_BYTES);
    }

    public static function of(MappedRefusal $refusal): self
    {
        return new self($refusal->code, $refusal->message, $refusal->details);
    }

    /**
     * The tool result of the refusal: isError true, with the code, message and whether a retry may succeed.
     */
    public function toolResponse(): ResponseFactory
    {
        $structured = [
            'code' => $this->code->value,
            'message' => $this->message,
            'retryable' => $this->code->isRetryable(),
            ...array_intersect_key($this->details, ['next_action' => true]),
        ];

        return Response::make(
            Response::error(
                json_encode($structured, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE),
            ),
        )
            ->withStructuredContent($structured);
    }

    /**
     * The refusal of a resource read, which the package sends as a JSON-RPC error carrying this text.
     */
    public function resourceResponse(): Response
    {
        return Response::error("{$this->code->value}: {$this->message}");
    }
}
