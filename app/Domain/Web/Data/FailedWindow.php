<?php

declare(strict_types=1);

namespace App\Domain\Web\Data;

use App\Domain\Web\Enums\WindowState;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * A window whose reader failed: a message that names no internal detail; the error itself is logged with the key.
 */
#[TypeScript]
final class FailedWindow extends Data
{
    public const string MESSAGE = 'This window could not be loaded.';

    public function __construct(
        public readonly WindowState $state,
        public readonly string $message,
    ) {}

    public static function make(): self
    {
        return new self(WindowState::Failed, self::MESSAGE);
    }
}
