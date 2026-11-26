<?php

declare(strict_types=1);

namespace Tests\Architecture;

use PhpParser\Node;
use PhpParser\Node\Expr;
use PhpParser\Node\Identifier;
use PhpParser\NodeFinder;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use SplFileInfo;
use Tests\Architecture\Support\ParsedFile;
use Tests\TestCase;

/**
 * A command test runs its command; a request to a route, an MCP tool or a host belongs to the route or tool test
 * (rule 106). The command tests of the old host protocol still send one until plan 80 removes their routes (task 3443),
 * and those task 3286 still rewrites; each leaves its list once it stops.
 */
final class CommandTestRequestsTest extends TestCase
{
    /**
     * The path of a command test, in core or in a domain.
     */
    private const string COMMAND_TEST = '#^(tests|domain/[^/]+/tests)/Commands/.+Test\.php$#';

    /**
     * The test journal's verbs that send a request.
     */
    private const array JOURNAL_REQUESTS = [
        'route',
        'jsonRoute',
        'mcpTool',
        'mcpFrame',
        'mcpRequest',
        'agentCall',
        'hostCall',
    ];

    /**
     * Laravel's verbs that send a request from a test.
     */
    private const array HTTP_REQUESTS = [
        'get',
        'getJson',
        'post',
        'postJson',
        'put',
        'putJson',
        'patch',
        'patchJson',
        'delete',
        'deleteJson',
        'json',
        'call',
    ];

    /**
     * Calls on the test that set a request up and hand the test back, as $this->actingAs($user)->post(...) does.
     */
    private const array REQUEST_SETUP = [
        'actingAs',
        'from',
        'withHeaders',
        'withHeader',
        'withSession',
        'withServerVariables',
        'withoutMiddleware',
    ];

    /**
     * The command tests whose web and relay scenarios task 3286 still rewrites to run their commands.
     */
    private const array REWRITING = [
        'domain/Chat/tests/Commands/DockSourceTest.php',
        'domain/Chat/tests/Commands/UndockSourceTest.php',
        'tests/Commands/Layouts/SaveLayoutTest.php',
        'tests/Commands/Messages/SendMessageTest.php',
    ];

    /**
     * The command tests of the old host and relay protocol, which plan 80 task 3443 rewrites or removes with their
     * routes.
     */
    private const array WAITING = [
        'tests/Commands/Agents/ChangeAgentModelTest.php',
        'tests/Commands/Agents/ClaimStartTest.php',
        'tests/Commands/Agents/DeliverAgentTest.php',
        'tests/Commands/Agents/NotifyFailureTest.php',
        'tests/Commands/Agents/NotifyRunningTest.php',
        'tests/Commands/Agents/NotifyRuntimeScreenTest.php',
        'tests/Commands/Agents/OpenAgentRuntimeTest.php',
        'tests/Commands/Agents/OpenHostMainRuntimeTest.php',
        'tests/Commands/Agents/ReconcileStartsTest.php',
        'tests/Commands/Agents/WakeAgentTest.php',
        'tests/Commands/Drivers/NotifyEntryReplayedTest.php',
        'tests/Commands/Drivers/NotifyRequestProgressTest.php',
        'tests/Commands/Drivers/NotifyRuntimeActivityTest.php',
        'tests/Commands/Navigation/AnswerNavigationTest.php',
        'tests/Commands/Navigation/InterruptNavigationTest.php',
        'tests/Commands/Navigation/MarkMenuEntryStaleTest.php',
        'tests/Commands/Navigation/ProveNavigationTest.php',
        'tests/Commands/Navigation/RaiseNavigationTest.php',
        'tests/Commands/Projects/CancelProjectCommandRunTest.php',
        'tests/Commands/Projects/FinishProjectCommandRunTest.php',
        'tests/Commands/Projects/RecordHostCallAnsweredTest.php',
        'tests/Commands/Projects/RecordHostDescriptorsTest.php',
        'tests/Commands/Projects/RecordHostProtectionTest.php',
        'tests/Commands/Projects/RecordProjectCommandProcessTest.php',
        'tests/Commands/Projects/StartProjectCommandRunTest.php',
        'tests/Commands/Sessions/RecordStopConditionResultsTest.php',
        'tests/Commands/Terminals/ResumeKeyScriptTest.php',
        'tests/Commands/Terminals/RunKeyScriptTest.php',
    ];

    public function test_no_command_test_sends_a_request_but_those_waiting_on_their_routes_removal(): void
    {
        $sending = $this->requestsByFile($this->commandTestFiles());

        $this->assertSame(
            [],
            array_diff_key($sending, array_flip([...self::REWRITING, ...self::WAITING])),
            'These command tests send a request, by line; run the command with the test journal, and prove the '
                .'request in its route or tool test:',
        );
        $this->assertSame(
            [],
            array_values(array_diff([...self::REWRITING, ...self::WAITING], array_keys($sending))),
            'These command tests no longer send a request; take them off the waiting list:',
        );
    }

    public function test_a_command_test_that_posts_or_calls_a_tool_is_named_with_its_lines(): void
    {
        $fixture = 'tests/Fixtures/CommandTests/PostingCommandScenario.php';

        $this->assertSame([$fixture => [21, 23, 27]], $this->requestsByFile([$fixture]));
    }

    /**
     * @return list<string>
     */
    private function commandTestFiles(): array
    {
        $files = [];

        foreach ([base_path('tests/Commands'), base_path('domain')] as $folder) {
            foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($folder)) as $file) {
                $path = $file instanceof SplFileInfo ? substr($file->getPathname(), strlen(base_path()) + 1) : '';

                if (preg_match(self::COMMAND_TEST, $path) === 1) {
                    $files[] = $path;
                }
            }
        }

        sort($files);

        return $files;
    }

    /**
     * Each file that sends a request, with the lines its requests start on.
     *
     * @param  list<string>  $files
     * @return array<string, list<int>>
     */
    private function requestsByFile(array $files): array
    {
        $found = [];

        foreach ($files as $file) {
            $calls = new NodeFinder()->find(
                ParsedFile::fromPath(base_path($file))->statements,
                fn (Node $node): bool => $node instanceof Expr\MethodCall && $this->sendsRequest($node),
            );
            $lines = array_values(array_unique(array_map(fn (Node $call) => $call->getStartLine(), $calls)));

            if ($lines !== []) {
                sort($lines);
                $found[$file] = $lines;
            }
        }

        return $found;
    }

    private function sendsRequest(Expr\MethodCall $call): bool
    {
        if (! $call->name instanceof Identifier) {
            return false;
        }

        $name = $call->name->toString();

        return match (true) {
            in_array($name, self::JOURNAL_REQUESTS, true) => $this->isOnJournal($call->var),
            in_array($name, self::HTTP_REQUESTS, true) => $this->isOnTheTest($call->var),
            default => false,
        };
    }

    /**
     * $this->journal or $journal, or a chain of the journal's own verbs that hands it back.
     */
    private function isOnJournal(Expr $target): bool
    {
        return match (true) {
            $target instanceof Expr\PropertyFetch => $target->var instanceof Expr\Variable
                && $target->var->name === 'this'
                && $target->name instanceof Identifier
                && $target->name->toString() === 'journal',
            $target instanceof Expr\Variable => $target->name === 'journal',
            $target instanceof Expr\MethodCall => $this->isOnJournal($target->var),
            default => false,
        };
    }

    /**
     * $this, or a chain of request set-up calls on it.
     */
    private function isOnTheTest(Expr $target): bool
    {
        if ($target instanceof Expr\Variable) {
            return $target->name === 'this';
        }

        return $target instanceof Expr\MethodCall
            && $target->name instanceof Identifier
            && in_array($target->name->toString(), self::REQUEST_SETUP, true)
            && $this->isOnTheTest($target->var);
    }
}
