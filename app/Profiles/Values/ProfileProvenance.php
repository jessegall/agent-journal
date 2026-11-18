<?php

declare(strict_types=1);

namespace App\Profiles\Values;

use App\Profiles\Enums\PolicyOriginType;
use App\Profiles\Exceptions\ProfileFieldUnknown;

/**
 * Where a revision's effective launch policy came from: the hash of the activated configuration it was compiled from,
 * and the origin of each effective field.
 */
final readonly class ProfileProvenance
{
    /**
     * @param  list<FieldOrigin>  $origins
     */
    public function __construct(
        public string $configurationHash,
        public array $origins,
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
