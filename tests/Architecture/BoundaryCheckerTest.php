<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Domains\DomainRegistry;
use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\BoundaryChecker;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\NameKind;
use Tests\Architecture\Support\NameUse;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Fixtures\Boundary\Chat\ChatDomain;
use Tests\Fixtures\Boundary\Plans\PlansDomain;
use Tests\Fixtures\Boundary\Tasks\TasksDomain;

final class BoundaryCheckerTest extends TestCase
{
    public function test_allowed_uses_pass(): void
    {
        $this->assertSame([], $this->violationLines('Plans/UsesAllowed.php'));
    }

    public function test_the_domain_classes_use_only_what_they_declare(): void
    {
        $this->assertSame([], $this->violationLines('Plans/PlansDomain.php'));
        $this->assertSame([], $this->violationLines('Tasks/TasksDomain.php'));
    }

    public function test_every_forbidden_use_is_listed_with_its_reason(): void
    {
        $this->assertSame([
            '7 uses Tests\Fixtures\Boundary\Chat\Message, but Plans does not require Chat',
            '8 uses Tests\Fixtures\Boundary\Outside\Helper, which is project code outside every domain',
            '9 uses Tests\Fixtures\Boundary\PlansExtra\Thing, which is project code outside every domain',
            '18 uses Tests\Fixtures\Boundary\Chat\Message, but Plans does not require Chat',
            '18 uses Tests\Fixtures\Boundary\Outside\Helper, which is project code outside every domain',
            '18 uses Tests\Fixtures\Boundary\PlansExtra\Thing, which is project code outside every domain',
            '18 uses tests\fixtures\boundary\chat\Message, but Plans does not require Chat',
        ], $this->violationLines('Plans/UsesForbidden.php'));
    }

    public function test_the_shared_place_may_use_no_domain(): void
    {
        $use = new NameUse(dirname(__DIR__, 2).'/app/Domains/DomainRegistry.php', 3, 'Tests\Fixtures\Boundary\Chat\Message', NameKind::Type);

        $violations = $this->checker()->violations([$use]);

        $this->assertCount(1, $violations);
        $this->assertSame('uses Tests\Fixtures\Boundary\Chat\Message, but Domains does not require Chat', $violations[0]->reason());
    }

    public function test_the_report_names_each_file_and_line_and_ends_with_the_question(): void
    {
        $file = $this->fixtureFolder().'/Plans/UsesForbidden.php';
        $report = BoundaryReport::of($this->checker()->violations(DomainFiles::usesIn([$file], $this->roots())), dirname(__DIR__, 2));

        $this->assertStringStartsWith('Domain boundary violations (7):', $report);
        $this->assertStringContainsString(
            '  tests/Fixtures/Boundary/Plans/UsesForbidden.php:7 uses Tests\Fixtures\Boundary\Chat\Message, but Plans does not require Chat',
            $report,
        );
        $this->assertStringEndsWith(
            "Is the dependency right (add it to the Domain class, with the user's yes), or is the code in the wrong domain?",
            $report,
        );
    }

    /**
     * @return list<string>
     */
    private function violationLines(string $fixture): array
    {
        $uses = DomainFiles::usesIn([$this->fixtureFolder().'/'.$fixture], $this->roots());

        return array_map(
            fn ($violation) => "{$violation->line} {$violation->reason()}",
            $this->checker()->violations($uses),
        );
    }

    private function checker(): BoundaryChecker
    {
        return new BoundaryChecker($this->registry()->all(), $this->roots());
    }

    private function registry(): DomainRegistry
    {
        return DomainRegistry::from([ChatDomain::class, TasksDomain::class, PlansDomain::class]);
    }

    private function roots(): ProjectRoots
    {
        return ProjectRoots::fromComposer(dirname(__DIR__, 2).'/composer.json');
    }

    private function fixtureFolder(): string
    {
        return dirname($this->registry()->get('Plans')->folder);
    }
}
