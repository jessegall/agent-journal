<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\CallScan;
use Tests\Support\ScanCache\ScanCache;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * The bus opens the one transaction of a command (doc 19, section 6.11): no code of an owner moved onto the bus opens,
 * commits or rolls back a transaction itself or sets its isolation. The list grows phase by phase as owners move.
 */
#[TimeLimit(seconds: 15, reason: 'It parses the project files it judges.')]
final class ExplicitTransactionTest extends TestCase
{
    private const string HOW_TO_FIX = 'Name each transaction opener in OPENERS with its unit decision.';

    /**
     * The folders judged: the test modules now; each later phase adds the owner it moves.
     */
    public const array CHECKED = [
        'app/Agents/Commands',
        'app/Assignments/Commands',
        'app/Bus',
        'app/Records',
        'app/Sharing',
        'domain/Access/src',
        'domain/Chat/src',
        'domain/Documents/src',
        'domain/Memory/src',
        'domain/Plans/src',
        'app/Processes',
        'app/Profiles',
        'domain/Reminders/src',
        'domain/Rules/src',
        'domain/Sequences/src',
        'domain/Tasks/src',
        'tests/Fixtures/Modules',
    ];

    private const array TRANSACTION_CALLS = ['transaction', 'beginTransaction', 'commit', 'rollBack'];

    /**
     * The fixture handler that opens its own transaction on purpose, so the bus's guard can be shown refusing it.
     */
    private const array ALLOWED = [
        // The bus's own frame step: the one place that opens a command's transaction.
        'app/Bus/CommandMiddleware/RunInTransaction.php',
        'tests/Fixtures/Modules/Notes/src/Commands/OpenTransactionNote/OpenTransactionNoteHandler.php',
    ];

    /**
     * Every place of app and the domains that opens, commits or rolls back a transaction (doc 70, table 5), with its
     * decision: an owner of an event unit, one that joins a unit, or one that holds no unit.
     */
    public const array OPENERS = [
        'app/Bus/CommandMiddleware/RunInTransaction.php' => 'owns a unit: the command attempt',
        'app/Hooks/Support/StackTransaction.php' => 'owns a unit: the stack transaction',
        'app/Assignments/Storage/DatabaseAssignmentTransaction.php' => 'joins the open unit inside a command',
        'app/Agents/Support/DatabaseStartTransaction.php' => 'joins the open unit inside a command',
        'app/Actors/Support/ActiveActorsResolver.php' => 'no unit: a read-only snapshot',
        'app/Engine/Support/EnginePass.php' => 'no unit: rolls back what a pass left open',
        'app/Agents/Support/AgentChatAccess.php' => 'owns a unit: the console change of an agent\'s chat access',
        'app/Communication/Support/PresentationSweep.php' => 'owns a unit: each settled batch of the sweep',
        'app/Communication/Support/ReceiptDeliveries.php' => 'owns a unit: each delivery the queue tries',
    ];

    public function test_every_transaction_opener_of_the_application_is_named(): void
    {
        $folders = ['app', ...array_map(
            fn (string $folder) => substr($folder, strlen(base_path()) + 1),
            glob(base_path('domain/*/src'), GLOB_ONLYDIR) ?: [],
        )];
        $unnamed = array_filter(
            $this->transactionsIn($folders),
            fn (string $found) => ! array_key_exists(explode(':', explode(' ', $found)[0])[0], self::OPENERS),
        );

        $this->assertSame(
            [],
            array_values($unnamed),
            self::HOW_TO_FIX,
        );
    }

    public function test_no_checked_owner_opens_a_transaction_itself(): void
    {
        $this->assertSame([], $this->transactionsIn(self::CHECKED));
    }

    public function test_an_explicit_transaction_in_a_checked_folder_is_named(): void
    {
        $this->assertSame(
            ['tests/Fixtures/Bus/Bypass/OpensTransaction.php:14 calls transaction'],
            $this->transactionsIn(['tests/Fixtures/Bus/Bypass']),
        );
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function transactionsIn(array $folders): array
    {
        $found = [];

        foreach (ScanCache::findingsInFolders(new CallScan(), array_map(base_path(...), $folders)) as $path => $calls) {
            $file = substr($path, strlen(base_path()) + 1);

            if (in_array($file, self::ALLOWED, true)) {
                continue;
            }

            $code = (string) file_get_contents($path);

            foreach ($calls as $call) {
                if (in_array($call['method'], self::TRANSACTION_CALLS, true)) {
                    $found[] = "{$file}:{$call['line']} calls {$call['method']}";
                }
            }

            if (stripos($code, 'SET TRANSACTION') !== false) {
                $found[] = "{$file} sets a transaction isolation";
            }
        }

        return $found;
    }
}
