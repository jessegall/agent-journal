<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * A saved preview can no longer stand behind a share: it expired, belongs to someone else, was used already, or what
 * it showed has changed since. The owner saves a new preview.
 */
final class SharePreviewRefused extends RuntimeException implements CommandRefusal
{
    use RendersRefusal;

    public static function expired(string $previewId): self
    {
        return new self("Preview {$previewId} expired; preview the share again.");
    }

    public static function foreign(string $previewId): self
    {
        return new self("Preview {$previewId} belongs to another owner; preview the share again.");
    }

    public static function consumed(string $previewId): self
    {
        return new self("Preview {$previewId} was used already; preview the share again.");
    }

    public static function changed(string $previewId): self
    {
        return new self("What preview {$previewId} showed has changed since; preview the share again.");
    }

    protected function status(): int
    {
        return 409;
    }
}
