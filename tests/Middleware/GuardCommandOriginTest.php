<?php

declare(strict_types=1);

namespace Tests\Middleware;

use App\CommandMiddleware\GuardCommandOrigin;
use App\Contracts\Bus\GuardedCommandBus;
use App\Enums\Engine\CommandOriginStatus;
use Tests\Fixtures\Modules\Notes\Commands\CopyNote\CopyNoteCommand;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote\WriteNoteCommand;
use Tests\Support\Bus\RunsModuleCommands;
use Tests\Support\Entries\Attributes\TestsMiddleware;
use Tests\Support\TestIds;
use Tests\TestCase;

/**
 * A guarded command asks its origin inside its transaction, before authorization and its handler: an origin still
 * eligible runs it, a stale one or a target gone ends it with nothing written and says why, and a command the guarded
 * one dispatches is never asked again.
 */
#[TestsMiddleware(GuardCommandOrigin::class)]
final class GuardCommandOriginTest extends TestCase
{
    use RunsModuleCommands;

    /**
     * None at the start: the test modules' table is made as a test sets up and emptied when it ends.
     */
    private const array TABLES = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->installCommandModules();
        $this->journal->actAsUserId(TestIds::of(1));
    }

    public function test_an_eligible_origin_runs_the_command(): void
    {
        $status = $this->guarded()->runGuarded(
            new WriteNoteCommand('eligible'),
            fn () => CommandOriginStatus::Eligible,
        );

        $this->assertSame([CommandOriginStatus::Eligible, 1], [$status, $this->rowCount()]);
    }

    public function test_a_stale_origin_or_a_target_gone_ends_the_command_with_nothing_written(): void
    {
        $stale = $this->guarded()->runGuarded(new WriteNoteCommand('stale'), fn () => CommandOriginStatus::Stale);
        $gone = $this->guarded()->runGuarded(
            new WriteNoteCommand('gone'),
            fn () => CommandOriginStatus::TargetUnavailable,
        );

        $this->assertSame([CommandOriginStatus::Stale, CommandOriginStatus::TargetUnavailable], [$stale, $gone]);
        $this->assertSame(0, $this->rowCount());
    }

    public function test_the_origin_is_asked_once_for_the_guarded_command_and_never_for_one_it_dispatches(): void
    {
        $asked = 0;

        $this->guarded()->runGuarded(new CopyNoteCommand('nested'), function () use (&$asked): CommandOriginStatus {
            $asked++;

            return CommandOriginStatus::Eligible;
        });

        $this->assertSame(1, $asked);
        $this->assertGreaterThan(0, $this->rowCount());
    }

    private function guarded(): GuardedCommandBus
    {
        return $this->app->make(GuardedCommandBus::class);
    }
}
