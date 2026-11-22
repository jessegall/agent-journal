<?php

declare(strict_types=1);

namespace Tests\Fixtures\Search;

use Psr\Log\AbstractLogger;
use Stringable;

/**
 * A logger that keeps every line it is given, message and context, for a test to read.
 */
final class CollectingLogger extends AbstractLogger
{
    /**
     * @var list<array{message: string, context: array<string, mixed>}>
     */
    public array $lines = [];

    /**
     * @param  array<string, mixed>  $context
     */
    public function log($level, string|Stringable $message, array $context = []): void
    {
        $this->lines[] = ['message' => (string) $message, 'context' => $context];
    }
}
