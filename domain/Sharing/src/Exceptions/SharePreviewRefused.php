<?php

declare(strict_types=1);

namespace Domain\Sharing\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Exceptions\Concerns\ThrowsLater;
use RuntimeException;

/**
 * A saved preview can no longer stand behind a share: it expired, belongs to someone else, was used already, or what
 * it showed has changed since. The owner saves a new preview.
 */
final class SharePreviewRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    /**
     * @use ThrowsLater<SharePreviewRefused>
     */
    use ThrowsLater;

    public static function unknown(string $previewId): self
    {
        return new self("There is no preview {$previewId}; preview the share again.");
    }

    public static function targetGone(string $linkId): self
    {
        return new self("Link {$linkId} is no longer among the records to share; preview the share again.");
    }

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

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::StateBlocked;
    }
}
