<?php

declare(strict_types=1);

namespace App\Settings\Values;

use App\Settings\Exceptions\SettingReferenceInvalid;
use App\Settings\SettingKey;

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
