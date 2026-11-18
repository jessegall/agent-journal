<?php

declare(strict_types=1);

namespace App\Settings\Events;

use App\Contracts\Event;
use App\Settings\Enums\SettingTarget;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The one fact a settings command that changed something raises, after its transaction committed: whose settings,
 * which setting or group, and the revision they are at now; never the value. A command that changed nothing raises
 * none. Delivery is not guaranteed and nothing is kept to replay it.
 */
final readonly class SettingsChanged implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $owner,
        public SettingTarget $target,
        public string $key,
        public int $revision,
    ) {}
}
