<?php

declare(strict_types=1);

namespace Domain\Sharing\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Exceptions\ShareBudgetExceeded;
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
            sprintf(
                'This record links to too much to preview at once: %s Share a record with fewer links, or remove links you do not want to publish.',
                $exceeded->getMessage(),
            ),
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
