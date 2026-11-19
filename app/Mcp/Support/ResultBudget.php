<?php

declare(strict_types=1);

namespace App\Mcp\Support;

use App\Mcp\Data\ToolResult;
use App\Mcp\Exceptions\ResultTooLarge;
use Laravel\Mcp\Response;
use Laravel\Mcp\ResponseFactory;

/**
 * The byte budget of a tool result: 16 KiB for the whole result as sent, its structured content and the text that
 * mirrors it, of which 2 KiB stay free for status and recovery.
 */
final readonly class ResultBudget
{
    public const int RESULT_BYTES = 16384;

    public const int RECOVERY_BYTES = 2048;

    private const int JSON_FLAGS = JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE;

    /**
     * Whether a payload, counted with the text that mirrors it, leaves the 2 KiB kept for status and recovery.
     *
     * @param  array<string, mixed>  $payload
     */
    public function payloadFits(array $payload): bool
    {
        return self::payloadBytes($payload) <= self::RESULT_BYTES - self::RECOVERY_BYTES;
    }

    /**
     * The result as a structured response, refused when it is over budget.
     *
     * @throws ResultTooLarge
     */
    public function fit(ToolResult $result): ResponseFactory
    {
        if (! $this->payloadFits($result->payload)) {
            throw ResultTooLarge::for('payload', self::payloadBytes(
                $result->payload,
            ), self::RESULT_BYTES - self::RECOVERY_BYTES);
        }

        $structured = $result->structuredContent();
        $text = json_encode($structured, self::JSON_FLAGS);
        $resultBytes = strlen(
            json_encode(
                [
                    'content' => [['type' => 'text', 'text' => $text]],
                    'isError' => false,
                    'structuredContent' => $structured,
                ],
                self::JSON_FLAGS,
            ),
        );

        if ($resultBytes > self::RESULT_BYTES) {
            throw ResultTooLarge::for('whole', $resultBytes, self::RESULT_BYTES);
        }

        return Response::structured($structured);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private static function payloadBytes(array $payload): int
    {
        return 2 * strlen(json_encode($payload, self::JSON_FLAGS));
    }
}
