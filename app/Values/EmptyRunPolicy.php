<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\EmptyPolicy;
use App\Exceptions\VerificationContractInvalid;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * What a run with no output means: invalid, or a success the tool states by emitting nothing, shown with a fixed
 * summary such as "Type check completed; this mode emits no success text."
 */
#[MapName(SnakeCaseMapper::class)]
final class EmptyRunPolicy extends Data
{
    public function __construct(public readonly EmptyPolicy $policy, public readonly string $summary) {}

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
