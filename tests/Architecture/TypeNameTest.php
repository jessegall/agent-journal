<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\VerbNamedTypes;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * A class, interface or enum is named with a noun for what it is or the role it plays, never with a verb
 * phrase about what its implementer does; a trait or an attribute may say what the class using it does.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class TypeNameTest extends TestCase
{
    public function test_a_type_opening_with_a_verb_is_named_and_a_noun_a_trait_and_an_attribute_pass(): void
    {
        $this->assertSame(
            ['Tests\\Fixtures\\TypeNames\\RunsLaps'],
            $this->verbNamedIn([base_path('tests/Fixtures/TypeNames')]),
        );
    }

    public function test_no_type_of_the_core_or_the_domains_opens_with_a_verb(): void
    {
        $this->assertSame([], $this->verbNamedIn([app_path(), ...DomainFiles::domainCode()]));
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function verbNamedIn(array $folders): array
    {
        $found = ScanCache::findings(new VerbNamedTypes(), DomainFiles::in($folders));
        sort($found);

        return $found;
    }
}
