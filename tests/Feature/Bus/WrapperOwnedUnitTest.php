<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\CommandMiddleware\RunInTransaction;
use App\Support\CommandCall;
use App\Support\CommandNesting;
use App\Support\ListenerRegistry;
use App\Support\Publication;
use Domain\Tasks\Commands\StartTask\StartTaskCommand;
use Domain\Tasks\TasksDomain;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Schema;
use RuntimeException;
use Tests\Fixtures\Contracts\NotesFirstRename;
use Tests\Fixtures\Contracts\RaisingRow;
use Tests\Fixtures\Contracts\RowNoted;
use Tests\Fixtures\Contracts\RowRenamed;
use Tests\Support\DomainBoot;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Under the test wrapper's uncommitted transaction the first command owns an event unit as a commit would: its
 * transaction listener runs inside it, its public facts go out once it returns, and a command that throws sends none.
 */
final class WrapperOwnedUnitTest extends TestCase
{
    use RefreshHookDatabase;

    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(TasksDomain::class);
    }

    /**
     * @var list<string>
     */
    private array $heard = [];

    protected function setUp(): void
    {
        parent::setUp();

        Schema::create('raising_rows', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->timestamps();
        });
        $required = [RowRenamed::class => [NotesFirstRename::class.'@handle']];
        $this->app->instance(ListenerRegistry::class, new ListenerRegistry($required));
        $dispatcher = $this->app->make(Dispatcher::class);
        $dispatcher->listen(RowRenamed::class, fn (RowRenamed $renamed) => $this->heard[] = "renamed {$renamed->name}");
        $dispatcher->listen(RowNoted::class, fn () => $this->heard[] = 'noted');
    }

    public function test_the_transaction_listener_runs_inside_and_the_public_facts_go_out_when_the_command_returns(): void
    {
        $row = new RaisingRow();
        $row->name = 'start';
        $row->save();
        $heardInside = null;

        $this->command(function () use ($row, &$heardInside): void {
            $row->rename('first');
            $heardInside = $this->heard;
        });

        $this->assertSame([], $heardInside);
        $this->assertSame(['renamed first', 'noted'], $this->heard);
    }

    public function test_a_command_that_throws_sends_no_facts(): void
    {
        $row = new RaisingRow();
        $row->name = 'start';
        $row->save();

        $this->assertThrows(fn () => $this->command(function () use ($row): void {
            $row->rename('first');

            throw new RuntimeException('the command failed');
        }), RuntimeException::class);

        $this->assertSame([], $this->heard);
    }

    /**
     * Runs the work as a command's handler would, through the transaction step, the nesting and the release.
     *
     * @param  callable(): void  $work
     */
    private function command(callable $work): void
    {
        $call = CommandCall::of(new StartTaskCommand('task'), 'Tasks', true, false, null);
        $nesting = $this->app->make(CommandNesting::class);
        $nesting->enter(StartTaskCommand::class);

        try {
            $this->app->make(RunInTransaction::class)->handle($call, function () use ($work): null {
                $work();

                return null;
            });
        } finally {
            $nesting->leave();
            $this->app->make(Publication::class)->release();
        }
    }
}
