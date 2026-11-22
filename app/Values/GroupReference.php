<?php

declare(strict_types=1);

namespace App\Values;

use App\Exceptions\SettingReferenceInvalid;
use App\Support\SettingKey;

/**
 * The address of one settings group: its owner and its key there. A well-formed address grants nothing; the handler
 * checks who may change it and that it is registered.
 */
final readonly class GroupReference
{
    /**
     * @throws SettingReferenceInvalid
     */
    public function __construct(public string $owner, public string $key)
    {
        SettingKey::assertValidAddress($owner, $key);
    }
}
