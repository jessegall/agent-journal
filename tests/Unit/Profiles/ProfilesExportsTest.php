<?php

declare(strict_types=1);

namespace Tests\Unit\Profiles;

use App\CoreApi;
use App\Domains\Support\DomainRegistry;
use App\Profiles\Contracts\ProfileResolver;
use App\Profiles\Exceptions\ProfileKeyInvalid;
use App\Profiles\Exceptions\ProfileMissing;
use App\Profiles\Support\BuiltInAuthorizations;
use App\Profiles\Values\ProfileBase;
use App\Profiles\Values\ProfileKey;
use App\Profiles\Values\ProfileSnapshot;
use Tests\Fixtures\Profiles\TestLaunchPolicies;
use Tests\TestCase;

/**
 * Profiles is Core: no domain carries it, and Core exports its reader, key, type, snapshot and exceptions.
 */
final class ProfilesExportsTest extends TestCase
{
    public function test_core_exports_the_profile_reader_values_and_exceptions(): void
    {
        $exports = CoreApi::exports();

        $this->assertContains(ProfileResolver::class, $exports->contracts);
        $this->assertContains(ProfileKey::class, $exports->values);
        $this->assertContains(ProfileBase::class, $exports->values);
        $this->assertContains(ProfileSnapshot::class, $exports->values);
        $this->assertContains(ProfileKeyInvalid::class, $exports->exceptions);
        $this->assertContains(ProfileMissing::class, $exports->exceptions);
    }

    public function test_no_profiles_domain_is_registered_or_autoloaded(): void
    {
        $domains = DomainRegistry::installedClasses(base_path());
        $composer = json_decode((string) file_get_contents(base_path('composer.json')), true, flags: JSON_THROW_ON_ERROR);

        $this->assertSame([], array_values(array_filter($domains, fn (string $class) => str_contains($class, 'Profiles'))));
        $this->assertArrayNotHasKey('Domain\\Profiles\\', $composer['autoload']['psr-4']);
        $this->assertSame(['main-agent', 'writing-helper', 'read-only-helper'], array_column(ProfileBase::all(), 'key'));
    }

    public function test_a_snapshot_keeps_an_absent_allowlist_apart_from_an_empty_one(): void
    {
        $absent = ProfileSnapshot::from([
            'key' => ProfileKey::from('journal-reviewer'),
            'revision' => 1,
            'base' => ProfileBase::readOnlyHelper(),
            'instructions' => 'Review the change.',
            'model' => 'opus',
            'skillAllowlist' => null,
            'requiredSkills' => [],
            'launch' => TestLaunchPolicies::for(ProfileBase::readOnlyHelper()),
            'authorization' => BuiltInAuthorizations::for(ProfileBase::readOnlyHelper()),
        ]);
        $none = ProfileSnapshot::from([
            ...$absent->all(),
            'key' => $absent->key,
            'launch' => $absent->launch,
            'skillAllowlist' => [],
        ]);

        $this->assertNull($absent->skillAllowlist);
        $this->assertSame([], $none->skillAllowlist);
        $this->assertSame('journal-reviewer', $none->key->key);
    }
}
