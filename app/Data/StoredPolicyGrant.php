<?php

declare(strict_types=1);

namespace App\Data;

use App\Exceptions\GrantShapeInvalid;
use App\Values\PolicyGrant;
use Spatie\LaravelData\Data;

/**
 * One stored policy grant: exactly a policy class and an access, read through PolicyGrant::fromArray, which refuses
 * any other keys.
 *
 * @method static array<int, static> collect(mixed $items) read only from decoded JSON, so always an array
 */
final class StoredPolicyGrant extends Data
{
    public function __construct(public readonly PolicyGrant $grant) {}

    /**
     * @param  array<string, mixed>  $fields
     *
     * @throws GrantShapeInvalid
     */
    public static function fromArray(array $fields): self
    {
        return new self(PolicyGrant::fromArray($fields));
    }
}
