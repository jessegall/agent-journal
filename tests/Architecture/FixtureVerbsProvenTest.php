<?php

declare(strict_types=1);

namespace Tests\Architecture;

use App\Support\DeclaredType;
use App\Support\ReflectedMethod;
use App\Support\Reflector;
use FilesystemIterator;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Tests\Architecture\Support\CallScan;
use Tests\Support\Agents\TestAgent;
use Tests\Support\Agents\TestSession;
use Tests\Support\Assertions\Assert;
use Tests\Support\Assertions\StateAssert;
use Tests\Support\Hosts\MockHost;
use Tests\Support\Hosts\RecordedTerminalHost;
use Tests\Support\Hosts\TestEnrolledHost;
use Tests\Support\Hosts\TestHost;
use Tests\Support\Hosts\TestHostInstruction;
use Tests\Support\Hosts\TestHostProcess;
use Tests\Support\Mocks\Answer;
use Tests\Support\Mocks\ClaudeMock;
use Tests\Support\Mocks\CodexMock;
use Tests\Support\Recordings\TestAgentApi;
use Tests\Support\Recordings\TestScenario;
use Tests\Support\Recordings\WireAssert;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\Seeding\StateHandle;
use Tests\Support\Seeding\TestJournal;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Every public verb of the test journal and of each domain's fixture objects is called by a test of the fixture
 * itself: the journal's in tests/Machinery/Seeding (or tests/Wire/Seeding for the real host's), a domain fixture's in the tests beside it, so no test leans on a
 * verb nobody proved; every verb of a subject the journal opens a scope on is called by some test.
 */
#[TimeLimit(seconds: 60, reason: 'It parses the seeding and fixture tests, and every test for the subjects.')]
final class FixtureVerbsProvenTest extends TestCase
{
    private const string HOW_TO_FIX = 'Prove each verb by a test of the fixture itself:';

    private const string REGISTRAR = 'Fixtures.php';

    /**
     * The subjects the test journal opens a scope on, each verb of which a test must use.
     */
    private const array SUBJECTS = [
        Assert::class,
        StateAssert::class,
        StateHandle::class,
        TestHost::class,
        TestHostProcess::class,
        TestHostInstruction::class,
        TestEnrolledHost::class,
        TestAgent::class,
        TestSession::class,
        CodexMock::class,
        ClaudeMock::class,
        Answer::class,
        TestScenario::class,
        WireAssert::class,
        MockHost::class,
        TestAgentApi::class,
        RecordedTerminalHost::class,
    ];

    public function test_every_fixture_verb_is_called_by_a_test_of_its_fixture(): void
    {
        $journalTests = [
            ...glob(base_path('tests/Machinery/Seeding/*Test.php')) ?: [],
            ...glob(base_path('tests/Wire/Seeding/*Test.php')) ?: [],
        ];
        $unproven = $this->unprovenOf(Reflector::of(TestJournal::class), $journalTests);

        foreach (glob(base_path('domain/*/tests/Fixtures/*Fixtures.php')) ?: [] as $file) {
            if (basename($file) === self::REGISTRAR) {
                continue;
            }

            $fixture = Reflector::find(self::classIn($file))->get();
            $unproven = [...$unproven, ...$this->unprovenOf($fixture, glob(dirname($file).'/*Test.php') ?: [])];
        }

        $this->assertSame([], $unproven, self::HOW_TO_FIX);
    }

    public function test_every_verb_of_a_subject_the_journal_scopes_into_is_called_by_a_test(): void
    {
        $called = self::calledIn(self::everyTest());
        $unproven = [];

        foreach (self::SUBJECTS as $subject) {
            $type = Reflector::of($subject);
            $verbs = array_values(array_filter(
                $type->methods(),
                fn (ReflectedMethod $method) => $method->isPublic()
                    && ! $method->isStatic()
                    && self::returnsItsSubject($method)
                    && ! in_array($method->name(), $called, true),
            ));
            $unproven = [...$unproven, ...array_map(
                fn (ReflectedMethod $method) => $type->shortName().'::'.$method->name(),
                $verbs,
            )];
        }

        $this->assertSame([], $unproven, self::HOW_TO_FIX);
    }

    /**
     * Whether the method is a verb of its subject: it hands the subject back.
     */
    private static function returnsItsSubject(ReflectedMethod $method): bool
    {
        return $method->returnType()
            ->map(fn (DeclaredType $type) => $type->isNamed() && in_array($type->name(), ['self', 'static'], true))
            ->getOrElse(false);
    }

    /**
     * Each method name the tests call.
     *
     * @param  list<string>  $tests
     * @return list<string>
     */
    private static function calledIn(array $tests): array
    {
        $called = [];

        foreach (ScanCache::findingsByFile(new CallScan(), $tests) as $calls) {
            $called = [...$called, ...array_column($calls, 'method')];
        }

        return array_values(array_unique($called));
    }

    /**
     * Each test file of the project and of every domain.
     *
     * @return list<string>
     */
    private static function everyTest(): array
    {
        $tests = [];

        foreach ([base_path('tests'), ...glob(base_path('domain/*/tests')) ?: []] as $folder) {
            $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($folder, FilesystemIterator::SKIP_DOTS));

            foreach ($files as $file) {
                if (str_ends_with($file->getFilename(), 'Test.php')) {
                    $tests[] = $file->getPathname();
                }
            }
        }

        sort($tests);

        return $tests;
    }

    /**
     * Each public method of the class, its traits' included, that none of the tests calls, as Class::method.
     *
     * @param  Reflector<object>  $type
     * @param  list<string>  $tests
     * @return list<string>
     */
    private function unprovenOf(Reflector $type, array $tests): array
    {
        $called = self::calledIn($tests);
        $unproven = array_filter(
            $type->methods(),
            fn (ReflectedMethod $method) => $method->isPublic()
                && ! $method->isStatic()
                && ! str_starts_with($method->name(), '__')
                && ! in_array($method->name(), $called, true),
        );

        return array_values(array_map(
            fn (ReflectedMethod $method) => $type->shortName().'::'.$method->name(),
            $unproven,
        ));
    }

    /**
     * The fixture class a file under domain/<Domain>/tests/Fixtures declares, named from its folder and file.
     */
    private static function classIn(string $file): string
    {
        $domain = basename(dirname($file, 3));

        return 'Domain\\'.$domain.'\\Tests\\Fixtures\\'.basename($file, '.php');
    }
}
