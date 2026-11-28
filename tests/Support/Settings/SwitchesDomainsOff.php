<?php

declare(strict_types=1);

namespace Tests\Support\Settings;

use App\Models\Records\SettingsRecord;
use App\Settings\Storage\EncodedEntry;
use App\Settings\Storage\EncodedValue;

/**
 * Switches a domain off in Core's shared settings and forgets the scoped instances that read the old switch.
 */
trait SwitchesDomainsOff
{
    private function switchDomainOff(string $domainKey): void
    {
        SettingsRecord::create('Core');
        $record = SettingsRecord::findSharedRuntimeForOwner('Core')->get();
        $switch = new EncodedEntry("domain_{$domainKey}", EncodedValue::of(false));
        $record->revise($record->document->withToggle($switch));
        $this->app->forgetScopedInstances();
    }
}
