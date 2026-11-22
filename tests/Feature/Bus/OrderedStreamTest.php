<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Support\EventUnitLifecycle;
use App\Support\RequiredListenerRegistry;
use Illuminate\Database\ConnectionInterface;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Tests\Fixtures\Contracts\LegacyRenameNoticed;
use Tests\Fixtures\Contracts\RaisingRow;
use Tests\Fixtures\Contracts\RowRenamed;
use Tests\Fixtures\Contracts\StagesProgress;
use Tests\Support\CommitsHookRows;
use Tests\TestCase;

/**
 * Legacy sends and migrated facts share one stream in the order they were made: L1, M, L2 and M1, L, M2 release in
 * those orders after the commit, an occurrence a required listener stages takes its place, and a rollback sends none.
 */
final class OrderedStreamTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    /**
     * @var list<string>
     */
    private array $released = [];

    protected function setUp(): void
    {
        parent::setUp();

        Schema::dropIfExists('raising_rows');
        Schema::create('raising_rows', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
        $this->useRequired([]);
        $dispatcher = $this->app->make(Dispatcher::class);
        $dispatcher->listen(RowRenamed::class, fn (RowRenamed $renamed) => $this->released[] = "M {$renamed->name}");
        $dispatcher->listen(
            LegacyRenameNoticed::class,
            fn (LegacyRenameNoticed $noticed) => $this->released[] = "L {$noticed->label}",
        );
    }

    protected function tearDown(): void
    {
        Schema::dropIfExists('raising_rows');

        parent::tearDown();
    }

    public function test_legacy_migrated_legacy_releases_in_that_order(): void
    {
        $row = $this->row();

        $this->commit(function () use ($row): void {
            $this->stream('one');
            $row->rename('middle');
            $this->stream('two');
        });

        $this->assertSame(['L one', 'M middle', 'L two'], $this->released);
    }

    public function test_migrated_legacy_migrated_releases_in_that_order(): void
    {
        [$first, $second] = [$this->row(), $this->row()];

        $this->commit(function () use ($first, $second): void {
            $first->rename('one');
            $this->stream('middle');
            $second->rename('two');
        });

        $this->assertSame(['M one', 'L middle', 'M two'], $this->released);
    }

    public function test_a_required_listeners_staged_occurrence_releases_after_the_commit_in_its_place(): void
    {
        $this->useRequired([RowRenamed::class => [StagesProgress::class.'@handle']]);
        [$first, $second] = [$this->row(), $this->row()];

        $this->commit(function () use ($first, $second): void {
            $first->rename('one');
            $second->rename('two');
        });

        $this->assertSame(['M one', 'M two', 'L progress of one', 'L progress of two'], $this->released);
    }

    public function test_a_rollback_releases_nothing(): void
    {
        $row = $this->row();

        $this->assertThrows(fn () => $this->commit(function () use ($row): void {
            $this->stream('lost');
            $row->rename('lost');

            throw new RuntimeException('the command failed');
        }), RuntimeException::class);

        $this->assertSame([], $this->released);
    }

    /**
     * @param  array<string, list<string>>  $required
     */
    private function useRequired(array $required): void
    {
        $this->app->instance(RequiredListenerRegistry::class, new RequiredListenerRegistry($required));
    }

    private function stream(string $label): void
    {
        $this->app->make(EventUnitLifecycle::class)->publishAfterCommit(new LegacyRenameNoticed($label));
    }

    private function row(): RaisingRow
    {
        return RaisingRow::query()->create(['name' => 'start']);
    }

    private function commit(callable $work): void
    {
        $database = $this->app->make(ConnectionInterface::class);
        $database->beginTransaction();
        $this->app->make(EventUnitLifecycle::class)->own(
            $database,
            'the test',
            $work(...),
            fn () => $database->commit(),
            fn () => $database->rollBack(),
        );
    }
}
