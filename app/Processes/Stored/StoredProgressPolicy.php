<?php

declare(strict_types=1);

namespace App\Processes\Stored;

use App\Processes\Enums\ProgressType;
use App\Processes\Values\ProgressPolicy;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * How a check shows how far it has got, as a stored contract holds it.
 */
#[MapName(SnakeCaseMapper::class)]
final class StoredProgressPolicy extends Data
{
    /**
     * @param  list<string>  $listing
     */
    public function __construct(
        public readonly ProgressType $type,
        public readonly array $listing,
        public readonly string $selectionFingerprint,
    ) {}

    public static function fromProgressPolicy(ProgressPolicy $progress): self
    {
        return self::from([
            'type' => $progress->type,
            'listing' => $progress->listing,
            'selection_fingerprint' => $progress->selectionFingerprint,
        ]);
    }

    public function toProgressPolicy(): ProgressPolicy
    {
        return ProgressPolicy::stored($this->type, $this->listing, $this->selectionFingerprint);
    }
}
