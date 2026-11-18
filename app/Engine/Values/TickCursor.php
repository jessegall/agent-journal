<?php

declare(strict_types=1);

namespace App\Engine\Values;

/**
 * Where the engine's tick selection stopped: the last frame position it took on a stack, so the next pass goes on
 * after it rather than starting over.
 */
final readonly class TickCursor
{
    private function __construct(
        public string $stackId,
        public int $position,
    ) {}

    /**
     * Before the first stack, as on a fresh start.
     */
    public static function start(): self
    {
        return new self('', -1);
    }

    public static function after(string $stackId, int $position): self
    {
        return new self($stackId, $position);
    }

    /**
     * Whether a frame at this position of this stack comes after the cursor.
     */
    public function precedes(string $stackId, int $position): bool
    {
        return $stackId > $this->stackId || ($stackId === $this->stackId && $position > $this->position);
    }
}
