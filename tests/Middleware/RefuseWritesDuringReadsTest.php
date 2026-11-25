<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\CommandMiddleware\RefuseWritesDuringReads;
use App\Commands\Layouts\SaveLayout\SaveLayoutCommand;
use App\Data\Layouts\LayoutShape;
use App\Exceptions\ReadOnlyWriteRefused;
use App\Models\Records\Layout;
use App\Support\ReadOnlyStretch;
use Tests\Commands\Layouts\SaveLayoutTest;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\RefreshHookDatabase;
use Tests\TestCase;

/**
 * Before anything else checks it, every command run while something only reads is refused and writes nothing; once the
 * read ends, the same command runs.
 */
#[TestsMiddleware(RefuseWritesDuringReads::class)]
final class RefuseWritesDuringReadsTest extends TestCase
{
    use RefreshHookDatabase;

    public function test_a_command_run_while_a_condition_evaluates_is_refused_and_writes_nothing(): void
    {
        $this->journal->owner()->actAs('Owner');
        $command = new SaveLayoutCommand('Writing', LayoutShape::from(SaveLayoutTest::shape('chat')));

        $this->assertThrows(
            fn () => $this->app->make(ReadOnlyStretch::class)->during('a skill condition', fn () => $this->journal->run($command)),
            ReadOnlyWriteRefused::class,
        );
        $this->assertSame(0, Layout::query()->count());

        $this->journal->run($command);
        $this->assertSame(1, Layout::query()->count());
    }
}
