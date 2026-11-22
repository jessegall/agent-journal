<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Settings\SettingsAccessPolicy;
use App\Exceptions\SettingsAccessDenied;

/**
 * The one check before anyone inspects or changes settings: someone acts, and the access policy allows them.
 *
 * @internal
 */
final readonly class SettingsAccessGate
{
    public function __construct(private CurrentActor $actor, private SettingsAccessPolicy $access) {}

    /**
     * @throws SettingsAccessDenied
     */
    public function require(): void
    {
        if (! $this->actor->hasActor() || ! $this->access->allows($this->actor->actor())) {
            throw SettingsAccessDenied::forActor();
        }
    }
}
