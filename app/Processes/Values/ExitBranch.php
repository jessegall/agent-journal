<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\Outcome;
use App\Processes\Exceptions\VerificationContractInvalid;

/**
 * One exit status a check may end with, what it means, and the output evidence that must go with it, such as
 * summary.failed == 0. A signal is never a status.
 */
final readonly class ExitBranch
{
    private function __construct(public int $status, public Outcome $outcome, public string $requires) {}

    /**
     * @throws VerificationContractInvalid
     */
    public static function of(int $status, Outcome $outcome, string $requires): self
    {
        if ($status < 0 || $status > 255) {
            throw VerificationContractInvalid::field("exits.{$status}", 'an exit status is a number from 0 to 255');
        }
        if (trim($requires) === '') {
            throw VerificationContractInvalid::field(
                "exits.{$status}.requires",
                'each exit names the output evidence it requires',
            );
        }

        return new self($status, $outcome, $requires);
    }
}
