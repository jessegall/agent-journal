<?php

declare(strict_types=1);

namespace App\Sharing\Exceptions;

use App\Bus\Contracts\CommandRefusal;
use App\Concerns\RendersRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Engine\Enums\RefusalCode;
use RuntimeException;

/**
 * A preview or public read would do more work than its budget allows; only that preview or read is refused.
 */
final class ShareBudgetExceeded extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forQueries(int $most): self
    {
        return new self("This would run more than {$most} database queries; select fewer records.");
    }

    public static function forBytes(string $what, int $most): self
    {
        return new self("This would take more than {$most} bytes of {$what}; select fewer or smaller records.");
    }

    public static function forTime(int $mostMilliseconds): self
    {
        return new self("This would take longer than {$mostMilliseconds} milliseconds; select fewer records.");
    }

    public static function forNodes(int $most): self
    {
        return new self("This would reach more than {$most} records; select fewer records.");
    }

    public static function forLinks(int $most): self
    {
        return new self("This would follow more than {$most} links; select fewer records.");
    }

    public static function forHops(int $most): self
    {
        return new self("This would go deeper than {$most} relations from the shared record.");
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
