<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Profiles\PolicyOriginType;
use App\Exceptions\ProfileFieldUnknown;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\MapName;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Mappers\SnakeCaseMapper;

/**
 * Where a revision's effective start policy came from: the hash of the activated configuration it was compiled from,
 * and the origin of each effective field.
 */
#[MapName(SnakeCaseMapper::class)]
final class ProfileProvenance extends Data
{
    /**
     * @param  list<FieldOrigin>  $origins
     */
    public function __construct(
        public readonly string $configurationHash,
        #[DataCollectionOf(FieldOrigin::class)]
        public readonly array $origins,
    ) {}

    /**
     * Where the named field came from.
     *
     * @throws ProfileFieldUnknown
     */
    public function originOf(string $field): PolicyOriginType
    {
        foreach ($this->origins as $origin) {
            if ($origin->field === $field) {
                return $origin->origin;
            }
        }

        throw ProfileFieldUnknown::named($field);
    }
}
