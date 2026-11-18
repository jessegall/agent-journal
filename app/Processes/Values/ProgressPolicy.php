<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\ProgressType;
use App\Processes\Exceptions\VerificationContractInvalid;

/**
 * How far a check has got: an exact total from a listing operation, which must itself be admitted and match the run's
 * selection, a percentage the tool prints, or nothing more than its completed steps.
 */
final readonly class ProgressPolicy
{
    /**
     * @param  list<string>  $listing  the listing operation's name, for an exact total
     */
    private function __construct(public ProgressType $type, public array $listing, public string $selectionFingerprint) {}

    /**
     * @throws VerificationContractInvalid
     */
    public static function exactTotal(string $listingOperation, string $selectionFingerprint): self
    {
        if (trim($listingOperation) === '' || trim($selectionFingerprint) === '') {
            throw VerificationContractInvalid::field('progress', 'an exact total names its listing operation and the selection it must match');
        }

        return new self(ProgressType::ExactTotal, [$listingOperation], $selectionFingerprint);
    }

    public static function toolPercent(): self
    {
        return new self(ProgressType::ToolPercent, [], '');
    }

    public static function indeterminate(): self
    {
        return new self(ProgressType::Indeterminate, [], '');
    }
}
