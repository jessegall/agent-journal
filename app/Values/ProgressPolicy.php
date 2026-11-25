<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\ProgressType;
use App\Exceptions\VerificationContractInvalid;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * How far a check has got: an exact total from a listing operation, which must itself be admitted and match the run's
 * selection, a percentage the tool prints, or nothing more than its completed steps.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProgressPolicy extends Data
{
    /**
     * @param  list<string>  $listing  the listing operation's name, for an exact total
     */
    public function __construct(
        public readonly ProgressType $type,
        public readonly array $listing,
        public readonly string $selectionFingerprint,
    ) {}

    /**
     * @throws VerificationContractInvalid
     */
    public static function exactTotal(string $listingOperation, string $selectionFingerprint): self
    {
        if (trim($listingOperation) === '' || trim($selectionFingerprint) === '') {
            throw VerificationContractInvalid::field(
                'progress',
                'an exact total names its listing operation and the selection it must match',
            );
        }

        return new self(ProgressType::ExactTotal, [$listingOperation], $selectionFingerprint);
    }

    /**
     * The policy as it was stored, read back without the checks of a new one.
     *
     * @param  list<string>  $listing
     */
    public static function stored(ProgressType $type, array $listing, string $selectionFingerprint): self
    {
        return new self($type, $listing, $selectionFingerprint);
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
