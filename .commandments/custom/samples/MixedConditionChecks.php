<?php

declare(strict_types=1);

namespace App\Samples;

/**
 * Conditions over one object's checks: one named and one inline is the mix the mixed-condition-checks rule finds;
 * all named, all inline, or checks of two objects pass.
 */
final class MixedConditionChecksSamples
{
    public function sinful(SampleType $type): bool
    {
        $isAdapter = $type->is('adapter');

        // @sin MixedConditionChecksDetector
        return $isAdapter && $type->isSubclassOf('pipe');
    }

    public function fixed(SampleType $type): bool
    {
        $isAdapter = $type->is('adapter');
        $isPipe = $type->isSubclassOf('pipe');

        // @fixed MixedConditionChecksDetector
        return $isAdapter && $isPipe;
    }

    public function righteous(SampleType $type): bool
    {
        // @righteous MixedConditionChecksDetector
        return $type->is('adapter') && $type->isSubclassOf('pipe');
    }

    public function righteousOtherObjects(SampleType $type, SampleType $other): bool
    {
        $isAdapter = $type->is('adapter');

        // @righteous MixedConditionChecksDetector
        return $isAdapter && $other->isSubclassOf('pipe');
    }
}
