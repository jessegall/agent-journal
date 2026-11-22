<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\RefusalCode;
use RuntimeException;
use Throwable;

/**
 * An owner's approval was refused: the declaration conflicts with an active rule, or the reader and proof it names do
 * not prove this exact declaration revision.
 */
final class ApprovalRefused extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function conflict(Throwable $cause): self
    {
        return new self("The declaration conflicts with an active rule: {$cause->getMessage()}", previous: $cause);
    }

    public static function proofMissing(string $ruleId): self
    {
        return new self("The rule {$ruleId} is a test, check or build; approve it with its reader revision and proof.");
    }

    public static function readerWithoutContract(string $ruleId): self
    {
        return new self("The rule {$ruleId} has no verification contract, so its approval names no reader.");
    }

    public static function proofMismatch(string $proofId): self
    {
        return new self("Proof {$proofId} does not prove this reader revision for this declaration.");
    }

    public static function branchesUnproven(string $proofId): self
    {
        return new self("Proof {$proofId} does not cover every exit branch the contract admits.");
    }

    public static function checkWithoutRequest(string $ruleId): self
    {
        return new self("The rule {$ruleId} is a check: propose it for a request so its reader is proven.");
    }

    public static function bundleChanged(string $module): self
    {
        return new self("The rule bundle of {$module} is not installed with that version and digest; review it again.");
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
