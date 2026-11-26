<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\MorphKeyScan;
use Tests\Architecture\Support\ParsedFile;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every morphed Data class of app and the domains names the key its morph() reads in a MORPHED_BY constant, and that
 * constant names a #[PropertyForMorph] property of the class, so renaming the property cannot leave the key stale
 * (user 26945). The project commandment MorphKeyConstantDetector refuses a written key in morph() itself.
 */
#[TimeLimit(seconds: 15, reason: 'It parses every morphed Data file of app and the domains.')]
final class MorphKeyConstantTest extends TestCase
{
    private const string HOW_TO_FIX = 'Let MORPHED_BY name the #[PropertyForMorph] property: ';

    private const string FIXTURES = 'tests/Fixtures/Architecture/MorphKeys';

    public function test_every_morph_key_constant_names_a_morph_property(): void
    {
        $findings = [];

        foreach (DomainFiles::in([app_path(), ...DomainFiles::domainCode()]) as $path) {
            array_push($findings, ...MorphKeyScan::findingsIn(ParsedFile::fromPath($path)));
        }

        $this->assertSame([], $findings, self::HOW_TO_FIX.implode("\n", $findings));
    }

    public function test_a_constant_that_names_no_morph_property_is_found(): void
    {
        $findings = MorphKeyScan::findingsIn(ParsedFile::fromPath(base_path(self::FIXTURES.'/StaleMorphKey.php')));

        $this->assertCount(1, $findings);
    }

    public function test_a_constant_that_names_a_promoted_morph_property_passes(): void
    {
        $findings = MorphKeyScan::findingsIn(ParsedFile::fromPath(base_path(self::FIXTURES.'/PromotedMorphKey.php')));

        $this->assertSame([], $findings);
    }
}
