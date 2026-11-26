<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\Access\Contracts\OperationResolver;
use App\Access\Exceptions\OperationUnavailable;
use App\Bus\CommandMiddleware\RecordRefusalReceipt;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\Exceptions\NestedCommandFailureIgnored;
use App\Bus\RequestKey;
use App\CommandRules\Enums\ReceiptStatus;
use App\CommandRules\Exceptions\RefusalReplayed;
use Tests\Fixtures\Agents\TestStart;
use Tests\Fixtures\Modules\Notes\Commands\IgnoreFailedNote\IgnoreFailedNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\RefuseNote\RefuseNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Support\Bus\RunsModuleCommands;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\TestCase;

/**
 * An outermost keyed write of an agent session that is refused keeps its refusal once its transaction rolled back, so
 * a retry under the key gets the same refusal; a failure that is no refusal keeps nothing and the key stays free.
 */
#[TestsMiddleware(RecordRefusalReceipt::class)]
final class RecordRefusalReceiptTest extends TestCase
{
    use RunsModuleCommands;

    /**
     * The keyed writes commit their receipts and the signed start its rows, emptied around each test.
     */
    private const array TABLES = ['command_receipts', 'session_tokens', 'agent_sessions', 'agents'];

    private const string KEY = '01JD8X0G9M3QZ6V4K2RECEIPT1';

    private TestStart $start;

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandModules();
        $this->start = $this->journal->signedStart('Main agent', 'main-agent');
        $this->journal->actAsAgentIds($this->start->agent->id, $this->start->session->id);
        $this->app->make(RequestKey::class)->set(self::KEY);
    }

    public function test_a_refused_write_keeps_its_refusal_and_a_retry_gets_the_same_one(): void
    {
        $bus = $this->app->make(CommandBus::class);

        try {
            $bus->run(new RefuseNoteCommand('refused'));
            $this->fail('The write was not refused.');
        } catch (CommandRefused $refusal) {
            $message = $refusal->getMessage();
        }

        $this->assertThrows(fn () => $bus->run(new RefuseNoteCommand('refused')), RefusalReplayed::class, $message);
        $this->assertSame(
            ReceiptStatus::Refused,
            $this->app->make(OperationResolver::class)->operation(self::KEY)->state,
        );
        $this->assertSame(0, $this->rowCount());
    }

    public function test_a_rolled_back_write_leaves_no_receipt_so_the_key_is_safe_to_retry(): void
    {
        $bus = $this->app->make(CommandBus::class);

        $this->assertThrows(
            fn () => $bus->run(new IgnoreFailedNoteCommand('rolled back')),
            NestedCommandFailureIgnored::class,
        );

        $this->assertThrows(
            fn () => $this->app->make(OperationResolver::class)->operation(self::KEY),
            OperationUnavailable::class,
        );
        $id = $bus->run(new WriteNoteCommand('retried'));
        $this->assertSame('retried', $this->rowText($id));
    }
}
