<?php

declare(strict_types=1);

namespace Tests\Feature\Bus;

use App\Actors\Exceptions\ActorContextMissing;
use App\Actors\Exceptions\UserActorRequired;
use App\Bus\Contracts\CommandBus;
use Illuminate\Support\Facades\Log;
use Tests\Fixtures\Modules\Notes\Commands\UserNote;
use Tests\Fixtures\Modules\Notes\Commands\WriteNote;

/**
 * The actor of a command (doc 19, Book D): no command runs without one, a user-only command refuses an agent, and
 * the log line names the command, its owner, the actor and the outcome but no field.
 */
final class CommandActorTest extends CommandBusTestCase
{
    public function test_a_command_without_an_actor_runs_nothing(): void
    {
        $this->installCommandModules();

        $this->expectException(ActorContextMissing::class);

        $this->app->make(CommandBus::class)->run(new WriteNote('never'));
    }

    public function test_a_user_only_command_run_by_an_agent_is_refused(): void
    {
        $this->installCommandModules();
        $this->startRequestAs(7, 70);

        $this->expectException(UserActorRequired::class);

        $this->app->make(CommandBus::class)->run(new UserNote('mine'));
    }

    public function test_each_command_logs_its_name_owner_actor_and_outcome_and_no_field(): void
    {
        $this->installCommandModules();
        $this->startUserRequestAs(1);
        $log = Log::spy();

        $this->app->make(CommandBus::class)->run(new WriteNote('private text'));

        $log->shouldHaveReceived('info')->withArgs(fn (string $line, array $context) => $line === 'Command WriteNote done'
            && $context['owner'] === 'Notes' && $context['actor'] === 'user:1' && ! str_contains((string) json_encode($context), 'private text'));
    }
}
