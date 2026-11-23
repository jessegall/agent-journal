<?php

declare(strict_types=1);

namespace Tests\Feature\Numbers;

use App\Contracts\Bus\CommandBus;
use App\Exceptions\CommandRefused;
use App\Exceptions\CommandTransactionMissing;
use App\Exceptions\NumberChanged;
use App\Exceptions\NumberedModelUndeclared;
use App\Exceptions\NumberLimitReached;
use App\Exceptions\StackLockTimedOut;
use App\Models\Records\GlobalGroup;
use App\Models\Records\NumberGroup;
use App\Support\NumberedTypeRegistry;
use App\Support\OperationDeadline;
use App\Support\OutsideCommandAllowance;
use App\Support\Reflector;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Modules\Ledger\Commands\OpenLedger\OpenLedgerCommand;
use Tests\Fixtures\Modules\Ledger\Commands\WriteEntry\WriteEntryCommand;
use Tests\Fixtures\Modules\Ledger\LedgerDomain;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Models\LedgerEntry;
use Tests\Support\CommitsHookRows;
use Tests\Support\InstallsCommandModules;
use Tests\Support\StartsAgentRequests;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Numbers within a group (doc 25, Books A and B): each group counts on its own, a refused command takes its number
 * back with it, a number never changes once saved, a save outside a command is refused, a held group lock ends in
 * the bus's lock timeout, and the cap refuses instead of wrapping. Every command commits for real.
 */
#[TimeLimit(seconds: 5, reason: 'It waits out a lock held on a second PostgreSQL connection.')]
final class NumberAllocationTest extends TestCase
{
    use CommitsHookRows;
    use InstallsCommandModules;
    use StartsAgentRequests;

    private const array TABLES = ['number_groups'];

    private CommandBus $commands;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createLedgerTables();
        $this->bootModules(LedgerDomain::class);
        $this->app->make(OutsideCommandAllowance::class)->forbid();
        GlobalGroup::installJournal();
        $this->startTestUserRequest(1);
        $this->commands = $this->app->make(CommandBus::class);
    }

    protected function tearDown(): void
    {
        $this->emptyTables('ledger_entries', 'ledgers');

        parent::tearDown();
    }

    public function test_each_group_counts_on_its_own(): void
    {
        $first = $this->commands->run(new OpenLedgerCommand('first'));
        $second = $this->commands->run(new OpenLedgerCommand('second'));

        $this->assertSame(
            [1, 2],
            [Ledger::query()->findOrFail($first)->number, Ledger::query()->findOrFail($second)->number],
        );
        $this->assertSame(1, $this->commands->run(new WriteEntryCommand($first, 'a')));
        $this->assertSame(2, $this->commands->run(new WriteEntryCommand($first, 'b')));
        $this->assertSame(1, $this->commands->run(new WriteEntryCommand($second, 'c')));
    }

    public function test_a_numbered_model_is_found_without_its_domain_listing_it(): void
    {
        $registry = $this->app->make(NumberedTypeRegistry::class);

        $this->assertFalse(Reflector::of(LedgerDomain::class)->hasMethod('numberedModels'));
        $registry->assertNumbered(new Ledger()->getMorphClass());
        $registry->assertNumbered(new LedgerEntry()->getMorphClass());

        $this->expectException(NumberedModelUndeclared::class);
        $registry->assertNumbered('ledger.nobody');
    }

    public function test_a_refused_command_takes_its_number_back_with_it(): void
    {
        $ledger = $this->commands->run(new OpenLedgerCommand('ledger'));

        try {
            $this->commands->run(new WriteEntryCommand($ledger, 'refused', refusedAfterSave: true));
            $this->fail('The write was not refused.');
        } catch (CommandRefused) {
            $this->assertSame(0, LedgerEntry::query()->count());
        }

        $this->assertSame(1, $this->commands->run(new WriteEntryCommand($ledger, 'kept')));
    }

    public function test_a_save_outside_a_command_is_refused(): void
    {
        $this->assertThrows(fn () => Ledger::query()->create(['title' => 'outside']), CommandTransactionMissing::class);
    }

    public function test_a_saved_number_never_changes(): void
    {
        $ledger = Ledger::query()->findOrFail($this->commands->run(new OpenLedgerCommand('ledger')));
        $ledger->number = 7;

        $this->expectException(NumberChanged::class);

        $ledger->save();
    }

    public function test_a_held_group_lock_ends_in_the_bus_lock_timeout(): void
    {
        $this->app->instance(OperationDeadline::class, new OperationDeadline(500));
        $ledger = $this->commands->run(new OpenLedgerCommand('ledger'));
        $this->commands->run(new WriteEntryCommand($ledger, 'first'));
        config(['database.connections.second_writer' => config('database.connections.'.config('database.default'))]);
        $secondWriter = DB::connection('second_writer');
        $secondWriter->beginTransaction();
        $secondWriter->table('number_groups')->where('holder_id', $ledger)->lockForUpdate()->first();

        try {
            $this->app->forgetScopedInstances();
            $this->startTestUserRequest(1);
            $this->app->make(CommandBus::class)->run(new WriteEntryCommand($ledger, 'waits'));
            $this->fail('The write did not wait on the held lock.');
        } catch (StackLockTimedOut) {
            $this->assertSame(1, LedgerEntry::query()->count());
        } finally {
            $secondWriter->rollBack();
            DB::purge('second_writer');
        }
    }

    public function test_the_last_number_refuses_instead_of_wrapping(): void
    {
        $ledger = $this->commands->run(new OpenLedgerCommand('ledger'));
        $this->commands->run(new WriteEntryCommand($ledger, 'first'));
        DB::table('number_groups')->where('holder_id', $ledger)->update(
            ['last_number' => NumberGroup::LAST_NUMBER_LIMIT],
        );

        $this->expectException(NumberLimitReached::class);

        $this->commands->run(new WriteEntryCommand($ledger, 'past the limit'));
    }

    private function createLedgerTables(): void
    {
        if (Schema::hasTable('ledgers')) {
            return;
        }

        Schema::create('ledgers', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('title');
            $table->timestamps();
            $table->unique(['number_group_id', 'number']);
        });
        Schema::create('ledger_entries', function (Blueprint $table): void {
            $table->ulid('id')->primary();
            $table->foreignUlid('ledger_id')->constrained('ledgers')->cascadeOnDelete();
            $table->foreignUlid('number_group_id')->constrained('number_groups')->restrictOnDelete();
            $table->unsignedBigInteger('number');
            $table->string('text');
            $table->timestamps();
            $table->unique(['number_group_id', 'number']);
        });
    }
}
