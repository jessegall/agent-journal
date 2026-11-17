<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Core\Actors\Actor;
use App\Core\CoreApi;
use App\Domain\DomainRegistry;
use App\Domain\Exceptions\AmbiguousDomainRoot;
use App\Domain\Exceptions\InvalidExports;
use App\Domain\Exports;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Domains\Leaky\LeakyDomain;
use Tests\Fixtures\Domains\Nesting\Inner\InnerDomain;
use Tests\Fixtures\Domains\Nesting\NestingDomain;

/**
 * The export lists are checked when the application starts: a plain list of names inside the owner, none twice.
 */
final class ExportsTest extends TestCase
{
    public function test_an_empty_list_exports_nothing_and_is_no_wildcard(): void
    {
        $this->assertSame([], Exports::check('Tasks', 'App\\Domain\\Tasks', []));
    }

    public function test_names_inside_the_owner_pass_without_a_leading_backslash(): void
    {
        $this->assertSame(
            ['App\\Domain\\Tasks\\Api\\TaskReader'],
            Exports::check('Tasks', 'App\\Domain\\Tasks', ['\\App\\Domain\\Tasks\\Api\\TaskReader']),
        );
    }

    public function test_a_keyed_list_is_refused(): void
    {
        $this->expectExceptionObject(InvalidExports::notAList('Tasks'));

        Exports::check('Tasks', 'App\\Domain\\Tasks', ['reader' => 'App\\Domain\\Tasks\\Api\\TaskReader']);
    }

    public function test_an_entry_that_is_no_name_is_refused_with_its_position(): void
    {
        $this->expectExceptionObject(InvalidExports::notAName('Tasks', 1));

        Exports::check('Tasks', 'App\\Domain\\Tasks', ['App\\Domain\\Tasks\\Api\\TaskReader', 7]);
    }

    public function test_the_same_name_twice_in_another_case_is_refused(): void
    {
        $this->expectExceptionObject(InvalidExports::listedTwice('Tasks', 'App\\Domain\\Tasks\\Api\\taskreader'));

        Exports::check('Tasks', 'App\\Domain\\Tasks', ['App\\Domain\\Tasks\\Api\\TaskReader', 'App\\Domain\\Tasks\\Api\\taskreader']);
    }

    public function test_a_name_outside_the_owner_or_only_sharing_its_prefix_is_refused(): void
    {
        $this->expectExceptionObject(InvalidExports::outsideOwner('Tasks', 'App\\Domain\\TasksArchive\\Reader', 'App\\Domain\\Tasks'));

        Exports::check('Tasks', 'App\\Domain\\Tasks', ['App\\Domain\\TasksArchive\\Reader']);
    }

    public function test_a_domain_exporting_another_owners_class_cannot_be_registered(): void
    {
        $this->expectExceptionObject(InvalidExports::outsideOwner('Leaky', Actor::class, 'Tests\\Fixtures\\Domains\\Leaky'));

        DomainRegistry::from([LeakyDomain::class]);
    }

    public function test_a_domain_inside_another_domains_root_is_refused(): void
    {
        $this->expectExceptionObject(AmbiguousDomainRoot::between('Nesting', 'Inner'));

        DomainRegistry::from([NestingDomain::class, InnerDomain::class]);
    }

    public function test_cores_list_passes_the_same_check(): void
    {
        $this->assertContains(Actor::class, Exports::check('Core', 'App\\Core', CoreApi::exports()));
    }
}
