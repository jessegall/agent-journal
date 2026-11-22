<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\EmptyPolicy;
use App\Exceptions\VerificationContractInvalid;

/**
 * What a run with no output means: invalid, or a success the tool states by emitting nothing, shown with a fixed
 * summary such as "Type check completed; this mode emits no success text."
 */
final readonly class EmptyRunPolicy
{
    private function __construct(public EmptyPolicy $policy, public string $summary) {}

    /**
     * The policy as it was stored, read back without the checks of a new one.
     */
    public static function stored(EmptyPolicy $policy, string $summary): self
    {
        return new self($policy, $summary);
    }

    public static function invalid(): self
    {
        return new self(EmptyPolicy::Invalid, '');
    }

    /**
     * @throws VerificationContractInvalid
     */
    public static function allowedSuccess(string $summary): self
    {
        if (trim($summary) === '') {
            throw VerificationContractInvalid::field(
                'output.empty',
                'an allowed empty success needs the summary text it shows',
            );
        }

        return new self(EmptyPolicy::AllowedSuccess, $summary);
    }
}
