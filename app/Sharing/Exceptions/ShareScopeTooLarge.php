<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;

/**
 * Finding what a share of this root could include would pass the preview's budget.
 */
final class ShareScopeTooLarge extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function because(ShareBudgetExceeded $exceeded): self
    {
        return new self(
            "This record links to too much to preview at once: {$exceeded->getMessage()} Share a record with fewer "
                .'links, or remove links you do not want to publish.',
            previous: $exceeded,
        );
    }

    protected function status(): int
    {
        return 422;
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }
}
