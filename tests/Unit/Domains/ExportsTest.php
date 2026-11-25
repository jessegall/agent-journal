<?php

declare(strict_types=1);

namespace Tests\Unit\Domains;

use App\Contracts\Actors\Actor;
use App\Contracts\Events\Event;
use App\Exceptions\AmbiguousDomainRoot;
use App\Exceptions\InvalidExports;
use App\Support\DomainRegistry;
use App\Support\ExportBuilder;
use App\Support\Exports as DeclaredExports;
use App\Support\ExportValidator;
use Domain\Tasks\Contracts\TaskResolver as TaskResolverContract;
use Domain\Tasks\Events\TaskFinished;
use Domain\Tasks\Exceptions\TaskMissing;
use Domain\Tasks\Resolvers\TaskResolver;
use Domain\Tasks\TasksDomain;
use Domain\Tasks\Values\TaskSummary;
use PHPUnit\Framework\Attributes\DataProvider;
use PHPUnit\Framework\TestCase;
use Tests\Fixtures\Domains\Leaky\LeakyDomain;
use Tests\Fixtures\Domains\Nesting\Inner\InnerDomain;
use Tests\Fixtures\Domains\Nesting\NestingDomain;
use Tests\Support\DomainBoot;

/**
 * The exports are checked when the application starts: every name exists, lies inside its owner and sits in the
 * list its type belongs in.
 */
final class ExportsTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    public function test_empty_exports_export_nothing_and_are_no_wildcard(): void
    {
        $this->assertSame([], ExportValidator::check('Tasks', 'Domain\\Tasks', DeclaredExports::make()->build())->all());
    }

    public function test_each_name_comes_back_without_its_leading_backslash(): void
    {
        $checked = ExportValidator::check(
            'Tasks',
            'Domain\\Tasks',
            DeclaredExports::make()->contracts('\\'.TaskResolverContract::class)->build(),
        );

        $this->assertSame([TaskResolverContract::class], $checked->contracts);
    }

    public function test_a_name_that_does_not_exist_is_refused_with_its_list(): void
    {
        $this->expectExceptionObject(InvalidExports::missing('Tasks', 'values', 'Domain\\Tasks\\Api\\TaskSumary'));

        ExportValidator::check(
            'Tasks',
            'Domain\\Tasks',
            DeclaredExports::make()->values('Domain\\Tasks\\Api\\TaskSumary')->build(),
        );
    }

    public function test_a_name_of_a_neighbouring_namespace_with_the_same_start_is_refused(): void
    {
        $this->expectExceptionObject(InvalidExports::outsideOwner('Task', TaskResolverContract::class, 'Domain\\Task'));

        ExportValidator::check('Task', 'Domain\\Task', DeclaredExports::make()->contracts(TaskResolverContract::class)->build());
    }

    public function test_a_domain_exporting_another_owners_class_cannot_be_registered(): void
    {
        $this->expectExceptionObject(
            InvalidExports::outsideOwner('Leaky', Actor::class, 'Tests\\Fixtures\\Domains\\Leaky'),
        );

        DomainRegistry::from([LeakyDomain::class]);
    }

    /**
     * @return iterable<string, array{ExportBuilder, InvalidExports}>
     */
    public static function misplacedExports(): iterable
    {
        yield 'an event under values' => [
            DeclaredExports::make()->values(TaskFinished::class),
            InvalidExports::notAValue('Tasks', TaskFinished::class, 'it is an event; export it under events'),
        ];

        yield 'a concrete reader under contracts' => [
            DeclaredExports::make()->contracts(TaskResolver::class),
            InvalidExports::notAnInterface('Tasks', TaskResolver::class),
        ];

        yield 'a plain value under commands' => [
            DeclaredExports::make()->commands(TaskSummary::class),
            InvalidExports::notACommand('Tasks', TaskSummary::class),
        ];

        yield 'an exception under values' => [
            DeclaredExports::make()->values(TaskMissing::class),
            InvalidExports::notAValue('Tasks', TaskMissing::class, 'it is an exception; export it under exceptions'),
        ];

        yield 'support outside Core' => [
            DeclaredExports::make()->support(TaskSummary::class),
            InvalidExports::supportOutsideCore('Tasks', TaskSummary::class),
        ];
    }

    #[DataProvider('misplacedExports')]
    public function test_a_name_in_the_wrong_list_is_refused_naming_where_it_belongs(
        ExportBuilder $exports,
        InvalidExports $refusal,
    ): void {
        $this->expectExceptionObject($refusal);

        ExportValidator::check('Tasks', 'Domain\\Tasks', $exports->build());
    }

    public function test_the_event_marker_itself_is_no_event(): void
    {
        $this->expectExceptionObject(InvalidExports::notAnEvent('Core', Event::class));

        ExportValidator::check('Core', 'App', DeclaredExports::make()->events(Event::class)->build());
    }

    public function test_a_domain_inside_another_domains_root_is_refused(): void
    {
        $this->expectExceptionObject(AmbiguousDomainRoot::between('Nesting', 'Inner'));

        DomainRegistry::from([NestingDomain::class, InnerDomain::class]);
    }
}
