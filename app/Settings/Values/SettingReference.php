<?php

declare(strict_types=1);

namespace App\Settings\Values;

use App\Settings\Exceptions\SettingReferenceInvalid;
use App\Settings\Support\SettingKey;

/**
 * The address of one setting: its owner and its key there. A well-formed address grants nothing; the handler checks
 * who may change it and that it is registered.
 */
final readonly class SettingReference
{
    /**
     * @throws SettingReferenceInvalid
     */
    public function __construct(public string $owner, public string $key)
    {
        SettingKey::requireAddress($owner, $key);
    }
}
