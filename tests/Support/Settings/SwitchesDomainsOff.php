<?php

declare(strict_types=1);

namespace Tests\Support\Settings;

use App\Settings\Models\SettingsRecord;
use App\Settings\Storage\EncodedToggle;
use App\Settings\Storage\EncodedValue;

/**
 * Switches a domain off in Core's shared settings and forgets the scoped instances that read the old switch.
 */
trait SwitchesDomainsOff
{
    private function switchDomainOff(string $domainKey): void
    {
        SettingsRecord::makeEmptyFor('Core');
        $record = SettingsRecord::sharedRuntimeForOwner('Core')->get();
        $switch = new EncodedToggle("domain_{$domainKey}", EncodedValue::of(false));
        $record->revise($record->document->withToggle($switch));
        $this->app->forgetScopedInstances();
    }
}
