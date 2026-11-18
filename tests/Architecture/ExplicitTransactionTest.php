<?php

declare(strict_types=1);

namespace Tests\Architecture;

use Tests\Architecture\Support\CallScan;
use Tests\Architecture\Support\DomainFiles;
use Tests\Architecture\Support\ParsedFile;
use Tests\TestCase;

/**
 * The bus opens the one transaction of a command (doc 19, section 6.11): no code of an owner moved onto the bus opens,
 * commits or rolls back a transaction itself or sets its isolation. The list grows phase by phase as owners move.
 */
final class ExplicitTransactionTest extends TestCase
{
    /**
     * The folders judged: the test modules now; each later phase adds the owner it moves.
     */
    public const array CHECKED = ['app/Agents/Handlers', 'app/Assignments/Handlers', 'app/Bus', 'domain/Access/src', 'domain/Chat/src', 'domain/Memory/src', 'domain/Plans/src', 'domain/Processes/src', 'domain/Profiles/src', 'domain/Reminders/src', 'domain/Rules/src', 'domain/Sequences/src', 'domain/Tasks/src', 'tests/Fixtures/Modules'];

    private const array TRANSACTION_CALLS = ['transaction', 'beginTransaction', 'commit', 'rollBack'];

    /**
     * The fixture handler that opens its own transaction on purpose, so the bus's guard can be shown refusing it.
     */
    private const array ALLOWED = [
        // The bus's own frame step: the one place that opens a command's transaction.
        'app/Bus/CommandMiddleware/RunInTransaction.php',
        'tests/Fixtures/Modules/Notes/src/Handlers/OpenTransactionNoteHandler.php',
    ];

    public function test_no_checked_owner_opens_a_transaction_itself(): void
    {
        $this->assertSame([], $this->transactionsIn(self::CHECKED));
    }

    public function test_an_explicit_transaction_in_a_checked_folder_is_named(): void
    {
        $this->assertSame(['tests/Fixtures/Bus/Bypass/OpensTransaction.php:14 calls transaction'], $this->transactionsIn(['tests/Fixtures/Bus/Bypass']));
    }

    /**
     * @param  list<string>  $folders
     * @return list<string>
     */
    private function transactionsIn(array $folders): array
    {
        $found = [];

        foreach (DomainFiles::in(array_map(base_path(...), $folders)) as $path) {
            $file = substr($path, strlen(base_path()) + 1);

            if (in_array($file, self::ALLOWED, true)) {
                continue;
            }

            $code = (string) file_get_contents($path);

            foreach (CallScan::of(ParsedFile::fromPath($path)) as $call) {
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
