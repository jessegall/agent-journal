<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\Domain;
use App\Support\DomainRegistry;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\DeclarationRules;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\Violation;
use Tests\Fixtures\Declarations\Good\GoodDomain;
use Tests\Fixtures\Declarations\Wrong\WrongDomain;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Domain classes, the files outside every domain, namespaces inside domain folders and the shared places: the domain
 * foundation and Core in app.
 * It does not see edits inside the listed starter-kit files beyond the domain names they use.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class DomainDeclarationTest extends TestCase
{
    private const string STARTER_KIT_REASON = 'is starter-kit code that uses '
        .'Tests\\Fixtures\\Declarations\\Good\\Thing of Good; starter-kit code may use no domain';

    /**
     * The starter-kit files that exist today, relative to app; new behaviour lives in a domain.
     */
    private const array STARTER_KIT_FILES = [
        'Http/Controllers/Controller.php',
        'Providers/AppServiceProvider.php',
    ];

    public function test_the_real_app_declares_everything_where_it_belongs(): void
    {
        $appFolder = $this->appFolder();
        $starterKitFiles = array_map(fn (string $file) => "{$appFolder}/{$file}", self::STARTER_KIT_FILES);
        $rules = $this->rules($this->app->make(DomainRegistry::class));
        $files = DomainFiles::in(DomainFiles::domainCode());

        $violations = [
            ...$rules->misnamedDomainClasses($files, 'Domain'),
            ...$rules->filesOutsideDomains($files, [], []),
            ...$rules->starterKitDomainUses($starterKitFiles),
            ...$rules->namespacesOutsideDomains(),
        ];

        $this->assertSame([], $violations, BoundaryReport::of($violations, base_path()));
    }

    public function test_a_domain_class_too_deep_or_misnamed_behind_an_abstract_base_fails(): void
    {
        $files = DomainFiles::in([$this->fixture('Good'), $this->fixture('Deep'), $this->fixture('Based')]);

        $this->assertSame([
            'declares Tests\\Fixtures\\Declarations\\Based\\ConcreteBased, but a Domain class must be Domain\\<Name>\\<Name>Domain',
            'declares Tests\\Fixtures\\Declarations\\Deep\\Inner\\InnerDomain, but a Domain class must be Domain\\<Name>\\<Name>Domain',
        ], $this->reasons(
            $this->rules($this->registry())->misnamedDomainClasses($files, 'Tests\Fixtures\Declarations'),
        ));
    }

    public function test_a_file_outside_domains_and_not_on_the_starter_kit_list_fails(): void
    {
        $listed = $this->fixture('App/Http/Listed.php');
        $files = DomainFiles::in([$this->fixture('App')]);

        $violations = $this->rules($this->registry())->filesOutsideDomains(
            $files,
            [$this->fixture('Shared')],
            [$listed],
        );

        $this->assertSame(
            [$this->fixture('App/Http/NewController.php')],
            array_map(fn (Violation $violation) => $violation->file, $violations),
        );
    }

    public function test_starter_kit_code_may_use_no_domain(): void
    {
        $violations = $this->rules($this->registry())->starterKitDomainUses([$this->fixture('App/Http/Listed.php')]);

        $this->assertContains(
            self::STARTER_KIT_REASON,
            $this->reasons($violations),
        );
    }

    public function test_a_file_declaring_another_domain_namespace_fails(): void
    {
        $this->assertSame(
            ['declares namespace Tests\Fixtures\Declarations\Good, outside Tests\Fixtures\Declarations\Wrong'],
            $this->reasons($this->rules($this->registry())->namespacesOutsideDomains()),
        );
    }

    /**
     * @param  list<Violation>  $violations
     * @return list<string>
     */
    private function reasons(array $violations): array
    {
        return array_map(fn (Violation $violation) => $violation->reason(), $violations);
    }

    private function rules(DomainRegistry $registry): DeclarationRules
    {
        return new DeclarationRules($registry->all(), ProjectRoots::fromComposer(base_path('composer.json')));
    }

    private function registry(): DomainRegistry
    {
        return DomainRegistry::from([GoodDomain::class, WrongDomain::class]);
    }

    /**
     * The folders are taken from the loaded classes, so the paths match whichever checkout the autoloader reads.
     */
    private function fixture(string $path): string
    {
        return dirname($this->registry()->get('Good')->folder).'/'.$path;
    }

    private function appFolder(): string
    {
        return app_path();
    }
}
