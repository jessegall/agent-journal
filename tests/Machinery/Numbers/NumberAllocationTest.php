<?php

declare(strict_types=1);

namespace Tests\Machinery\Numbers;

use App\Access\Exceptions\StackLockTimedOut;
use App\Bus\Contracts\CommandBus;
use App\Bus\Exceptions\CommandRefused;
use App\Bus\OutsideCommandAllowance;
use App\Exceptions\NumberChanged;
use App\Models\Records\GlobalGroup;
use App\Models\Records\NumberGroup;
use App\Numbers\LockingNumberAllocator;
use App\Records\Exceptions\NumberLimitReached;
use App\Support\OperationDeadline;
use Domain\Rules\RulesDomain;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Tests\Fixtures\Modules\Ledger\Commands\OpenLedger\OpenLedgerCommand;
use Tests\Fixtures\Modules\Ledger\Commands\WriteEntry\WriteEntryCommand;
use Tests\Fixtures\Modules\Ledger\LedgerDomain;
use Tests\Fixtures\Modules\Ledger\Models\Ledger;
use Tests\Fixtures\Modules\Ledger\Models\LedgerEntry;
use Tests\Support\CommitsHookRows;
use Tests\Support\DomainBoot;
use Tests\Support\Entries\Attributes\TestsMachinery;
use Tests\Support\InstallsCommandModules;
use Tests\Support\TestIds;
use Tests\Support\TimeLimits\TimeLimit;
use Tests\TestCase;

/**
 * Numbers within a group: each group counts on its own, a refused command takes its number
 * back with it, a number never changes once saved, a save outside a command is refused, a held group lock ends in
 * the bus's lock timeout, and the cap refuses instead of wrapping. Every command commits for real.
 */
#[TimeLimit(seconds: 5, reason: 'It waits out a lock held on a second PostgreSQL connection.')]
#[TestsMachinery(LockingNumberAllocator::class)]
final class NumberAllocationTest extends TestCase
{
    use CommitsHookRows;
    use InstallsCommandModules;

    private const array TABLES = ['number_groups'];

    /**
     * Rules, which the Notes test module requires.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(RulesDomain::class);
    }

    private CommandBus $commands;

    protected function setUp(): void
    {
        parent::setUp();

        $this->createLedgerTables();
        $this->bootModules(LedgerDomain::class);
        $this->app->make(OutsideCommandAllowance::class)->forbid();
        GlobalGroup::create();
        $this->journal->actAsUserId(TestIds::of(1));
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

    public function test_a_refused_command_takes_its_number_back_with_it(): void
    {
        $ledger = $this->commands->run(new OpenLedgerCommand('ledger'));

        try {
            $this->commands->run(new WriteEntryCommand($ledger, 'refused', isRefusedAfterSave: true));
            $this->fail('The write was not refused.');
        } catch (CommandRefused) {
            $this->assertSame(0, LedgerEntry::query()->count());
        }

        $this->assertSame(1, $this->commands->run(new WriteEntryCommand($ledger, 'kept')));
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
            $this->journal->actAsUserId(TestIds::of(1));
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
