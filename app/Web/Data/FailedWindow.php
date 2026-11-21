<?php

declare(strict_types=1);

namespace App\Web\Data;

use App\Web\Enums\WindowState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A window whose reader failed: a message that names no internal detail, and a safe reason when the reader gives
 * one; the error itself is logged with the key.
 */
#[TypeScript]
final class FailedWindow extends Data
{
    public const string MESSAGE = 'This window could not be loaded.';

    public function __construct(
        public readonly WindowState $state,
        public readonly string $message,
        public readonly string|null $reason = null,
    ) {}

    public static function make(): self
    {
        return new self(WindowState::Failed, self::MESSAGE);
    }

    /**
     * A failed read whose reader names a reason the user may read, such as a source that is not reachable.
     */
    public static function because(string $reason): self
    {
        return new self(WindowState::Failed, self::MESSAGE, $reason);
    }
}
