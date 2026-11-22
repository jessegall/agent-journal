<?php

declare(strict_types=1);

namespace Tests\Support;

use Psr\Log\AbstractLogger;
use Stringable;

/**
 * A logger that keeps every line it was given, with its level and context, for a test to read.
 */
final class RecordingLogger extends AbstractLogger
{
    /**
     * @var list<array{level: string, message: string, context: array<string, mixed>}>
     */
    public array $lines = [];

    /**
     * @param  array<string, mixed>  $context
     */
    public function log($level, string|Stringable $message, array $context = []): void
    {
        $this->lines[] = ['level' => (string) $level, 'message' => (string) $message, 'context' => $context];
    }

    /**
     * The context of the first line with this message, or none.
     *
     * @return array<string, mixed>
     */
    public function contextOf(string $message): array
    {
        foreach ($this->lines as $line) {
            if ($line['message'] === $message) {
                return $line['context'];
            }
        }

        return [];
    }
}
