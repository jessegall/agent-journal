<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\CoreApi;
use App\Support\DomainRegistry;
use PHPUnit\Framework\TestCase;
use Tests\Architecture\Support\BoundaryChecker;
use Tests\Architecture\Support\BoundaryReport;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\NameType;
use Tests\Architecture\Support\NameUse;
use Tests\Architecture\Support\ProjectRoots;
use Tests\Architecture\Support\Violation;
use Tests\Architecture\Support\ViolationType;
use Tests\Fixtures\Boundary\Chat\ChatDomain;
use Tests\Fixtures\Boundary\Plans\PlansDomain;
use Tests\Fixtures\Boundary\Tasks\TasksDomain;
use Tests\Support\JudgesFixtureFiles;
use Tests\Support\TimeLimits\TimeLimit;

#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class BoundaryCheckerTest extends TestCase
{
    use JudgesFixtureFiles;

    private const string FOUNDATION_REASON = 'uses Tests\Fixtures\Boundary\Chat\Message, '
        .'but the core or the domain foundation does not require Chat';

    private const string REPORT_HEAD = 'Domain boundary violations (7):';

    private const string FORBIDDEN_LINE = '  tests/Fixtures/Boundary/Plans/UsesForbidden.php:7 '
        .'uses Tests\\Fixtures\\Boundary\\Chat\\Message, but Plans does not require Chat';

    private const string REPORT_QUESTION = "Is the dependency right (add it to the Domain class, with the user's yes), "
        .'or is the code in the wrong domain?';

    /**
     * @return iterable<string, array{string, list<string>}>
     */
    public static function fixtures(): iterable
    {
        yield 'allowed uses of every type' => ['Plans/UsesAllowed.php', []];

        yield 'the Plans domain class' => ['Plans/PlansDomain.php', []];

        yield 'the Tasks domain class' => ['Tasks/TasksDomain.php', []];

        yield 'a domain skill reading an undeclared domain' => ['Plans/Skills/PlanSkillReadingChat.php', [
            '7 uses Tests\Fixtures\Boundary\Chat\Message, but Plans does not require Chat',
            '16 uses Tests\Fixtures\Boundary\Chat\Message, but Plans does not require Chat',
        ]];

        yield 'every forbidden use with its reason' => ['Plans/UsesForbidden.php', [
            '7 uses Tests\Fixtures\Boundary\Chat\Message, but Plans does not require Chat',
            '8 uses Tests\Fixtures\Boundary\Outside\Helper, which is project code outside every domain',
            '9 uses Tests\Fixtures\Boundary\PlansExtra\PlanExtra, which is project code outside every domain',
            '18 uses Tests\Fixtures\Boundary\Chat\Message, but Plans does not require Chat',
            '18 uses Tests\Fixtures\Boundary\Outside\Helper, which is project code outside every domain',
            '18 uses Tests\Fixtures\Boundary\PlansExtra\PlanExtra, which is project code outside every domain',
            '18 uses tests\fixtures\boundary\chat\Message, but Plans does not require Chat',
        ]];
    }

    public function test_the_shared_place_may_use_no_domain(): void
    {
        $use = new NameUse(
            dirname(__DIR__, 2).'/app/Domains/DomainRegistry.php',
            3,
            'Tests\Fixtures\Boundary\Chat\Message',
            NameType::Type,
        );

        $violations = $this->checker()->violations([$use]);

        $this->assertCount(1, $violations);
        $this->assertSame(
            self::FOUNDATION_REASON,
            $violations[0]->reason(),
        );
    }

    public function test_the_core_may_use_no_domain(): void
    {
        $use = new NameUse(
            dirname(__DIR__, 2).'/app/Hooks/AgentStacks.php',
            3,
            'Tests\Fixtures\Boundary\Chat\Message',
            NameType::Type,
        );

        $this->assertCount(1, $this->checker()->violations([$use]));
    }

    public function test_a_domain_uses_the_core_and_its_events_without_declaring_it(): void
    {
        $uses = [
            new NameUse(
                $this->fixtureFolder().'/Plans/UsesAllowed.php',
                3,
                'App\Contracts\Actors\Actor',
                NameType::Type,
            ),
            new NameUse(
                $this->fixtureFolder().'/Plans/Listeners/HearsStateTypes.php',
                4,
                'App\Events\Hooks\StateTypesRequested',
                NameType::Type,
            ),
        ];

        $this->assertSame([], $this->checker()->violations($uses));
    }

    public function test_a_domain_model_and_transaction_listener_use_the_exported_event_recording_pieces(): void
    {
        $files = [
            $this->fixtureFolder().'/Plans/Models/RecordingPlan.php',
            $this->fixtureFolder().'/Plans/Required/RequiredProgress.php',
        ];

        $this->assertSame([], $this->checker()->violations(DomainFiles::usesIn($files, $this->roots())));
    }

    public function test_a_domain_names_a_core_event_only_in_a_listener(): void
    {
        $use = new NameUse(
            $this->fixtureFolder().'/Plans/UsesAllowed.php',
            4,
            'App\Events\Hooks\StateTypesRequested',
            NameType::Type,
        );

        $this->assertSame(
            [ViolationType::EventOutsideListener],
            array_map(fn (Violation $violation) => $violation->type, $this->checker()->violations([$use])),
        );
    }

    public function test_a_private_type_of_a_required_domain_is_refused(): void
    {
        $use = new NameUse(
            $this->fixtureFolder().'/Plans/UsesAllowed.php',
            3,
            'Tests\Fixtures\Boundary\Tasks\TaskRecords',
            NameType::Type,
        );

        $this->assertSame(
            ["3 uses Tests\Fixtures\Boundary\Tasks\TaskRecords, which Tasks does not export; add it to Tasks's "
                .'exports() if it is meant to be public, or use what Tasks exports'],
            array_map(
                fn ($violation) => "{$violation->line} {$violation->reason()}",
                $this->checker()->violations([$use]),
            ),
        );
    }

    public function test_a_core_type_off_the_core_list_is_refused_to_a_domain(): void
    {
        $use = new NameUse(
            $this->fixtureFolder().'/Plans/UsesAllowed.php',
            3,
            'App\Support\AgentStacks',
            NameType::Type,
        );

        $violations = $this->checker()->violations([$use]);

        $this->assertSame(
            [ViolationType::PrivateCoreType],
            array_map(fn ($violation) => $violation->type, $violations),
        );
    }

    public function test_a_composition_file_names_only_what_it_composes(): void
    {
        $base = dirname(__DIR__, 2);
        $uses = [
            new NameUse("{$base}/bootstrap/domains.php", 4, ChatDomain::class, NameType::Import),
            new NameUse("{$base}/bootstrap/app.php", 5, 'Tests\Fixtures\Boundary\Chat\Message', NameType::Import),
            new NameUse("{$base}/config/auth.php", 6, 'App\Support\AgentStacks', NameType::Import),
        ];

        $this->assertSame(
            [[5, ViolationType::CompositionMisuse, 'Chat'], [6, ViolationType::CompositionMisuse, 'Core']],
            array_map(
                fn ($violation) => [$violation->line, $violation->type, $violation->owner],
                $this->checker()->compositionViolations($uses, $base),
            ),
        );
    }

    public function test_the_report_names_each_file_and_line_and_ends_with_the_question(): void
    {
        $file = $this->fixtureFolder().'/Plans/UsesForbidden.php';
        $report = BoundaryReport::of(
            $this->checker()->violations(DomainFiles::usesIn([$file], $this->roots())),
            dirname($this->fixtureFolder(), 3),
        );

        $this->assertStringStartsWith(self::REPORT_HEAD, $report);
        $this->assertStringContainsString(
            self::FORBIDDEN_LINE,
            $report,
        );
        $this->assertStringEndsWith(
            self::REPORT_QUESTION,
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
        return new BoundaryChecker($this->registry()->all(), $this->roots(), CoreApi::exports());
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
