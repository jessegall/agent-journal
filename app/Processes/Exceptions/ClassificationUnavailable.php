<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;
use Throwable;

/**
 * The project's rules could not be read, so no command can be classified: explain and admission refuse with
 * classification-unavailable, and nothing falls back to rules cached for another project.
 */
final class ClassificationUnavailable extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function storeFailed(Throwable $failure): self
    {
        return new self('classification-unavailable: the project rules could not be read.', previous: $failure);
    }

    public static function conflicting(Throwable $conflict): self
    {
        $message = "classification-unavailable: the active rules conflict. {$conflict->getMessage()}";

        return new self($message, previous: $conflict);
    }

    protected function status(): int
    {
        return 503;
    }
}
