<?php

declare(strict_types=1);

namespace Tests\Fixtures\Domains\Reviews\Settings;

use function PHPStan\Testing\assertType;

/**
 * Never run: PHPStan reads these assertions and fails the analysis when an enum setting loses its enum type.
 */
final class ReviewSettingsTypes
{
    public function enumSettingsKeepTheirEnum(ReviewSettings $settings): void
    {
        assertType(
'App\\Settings\\Declarations\\EnumSetting<Tests\\Fixtures\\Domains\\Reviews\\Enums\\ReviewMode>',
 $settings->reviewMode,
);
        assertType('Tests\\Fixtures\\Domains\\Reviews\\Enums\\ReviewMode|null', $settings->reviewMode->caseOf('quick'));
    }
}
