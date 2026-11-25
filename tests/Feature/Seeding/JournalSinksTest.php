<?php

declare(strict_types=1);

namespace Tests\Feature\Seeding;

use App\CommandMiddleware\LogCommand;
use App\Commands\Layouts\SaveLayout\SaveLayoutCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Bus\CommandEnd;
use App\Data\Layouts\LayoutShape;
use App\Models\Records\Layout;
use App\Support\CommandCall;
use App\Support\CommandOwner;
use PHPUnit\Framework\AssertionFailedError;
use Tests\Commands\Layouts\SaveLayoutTest;
use Tests\Support\Bus\ExpectedCommand;
use Tests\Support\CommitsHookRows;
use Tests\Support\Seeding\Enums\FixtureRefusalType;
use Tests\Support\Seeding\Exceptions\FixtureRefused;
use Tests\TestCase;

/**
 * Commands sunk by the journal end in the sink instead of their handlers: a route's command is recorded with the
 * whole frame it passed and writes nothing, a refused request sinks nothing, an arranged reply comes back, a replayed
 * key reaches the sink once, and the asserts fail on other arguments, another order or a short trail.
 */
final class JournalSinksTest extends TestCase
{
    use CommitsHookRows;

    private const array TABLES = [];

    public function test_a_route_sends_its_command_into_the_sink_through_every_middleware_and_writes_nothing(): void
    {
        $this->journal->owner()->sinkCommands();

        $this->journal->route(
            'POST',
            'layouts.store',
            payload: ['name' => 'Writing', 'shape' => SaveLayoutTest::shape('chat')],
        )
            ->assertRedirect();

        $this->journal->assertDispatched(SaveLayoutCommand::class, ['name' => 'Writing'])
            ->assertPassedEveryMiddleware(SaveLayoutCommand::class);
        $this->assertSame(0, Layout::query()->count());
    }

    public function test_a_request_its_validation_refuses_sinks_nothing(): void
    {
        $this->journal->owner()->sinkCommands();

        $this->journal->route(
            'POST',
            'layouts.store',
            payload: ['name' => '', 'shape' => SaveLayoutTest::shape('chat')],
        )
            ->assertSessionHasErrors('name');

        $this->journal->assertNothingDispatched();
    }

    public function test_an_arranged_reply_comes_back_and_a_replayed_key_reaches_the_sink_once(): void
    {
        $this->journal->owner()->agent('Ada')->sharedInbox('Owner', 'Ada')->sinkCommands();
        $inbox = $this->journal->sharedInboxOf('Owner', 'Ada');
        $this->journal->sinkReply(SendMessageCommand::class, 'message-1');
        $command = new SendMessageCommand($inbox->id, 'Hi');

        $first = $this->journal->run($command, 'key-1');
        $again = $this->journal->run($command, 'key-1');

        $this->assertSame(['message-1', 'message-1'], [$first, $again]);
        $this->journal->assertDispatched(SendMessageCommand::class, ['inboxId' => $inbox->id, 'body' => 'Hi'])
            ->assertMessageSent($inbox, 'Owner', 'Hi', 0);
    }

    public function test_commands_are_kept_in_order_and_other_arguments_or_order_fail(): void
    {
        $this->journal->owner()->sinkCommands();
        $shape = LayoutShape::from(SaveLayoutTest::shape('chat'));

        $this->journal->runUnkeyed(new SaveLayoutCommand('First', $shape));
        $this->journal->runUnkeyed(new SaveLayoutCommand('Second', $shape));

        $this->journal->assertDispatchedInOrder([
            ExpectedCommand::of(SaveLayoutCommand::class, ['name' => 'First']),
            ExpectedCommand::of(SaveLayoutCommand::class, ['name' => 'Second']),
        ]);
        $this->assertThrows(
            fn () => $this->journal->assertDispatchedInOrder([
                ExpectedCommand::of(SaveLayoutCommand::class, ['name' => 'Second']),
                ExpectedCommand::of(SaveLayoutCommand::class, ['name' => 'First']),
            ]),
            AssertionFailedError::class,
        );
        $this->assertThrows(
            fn () => $this->journal->assertDispatched(SaveLayoutCommand::class, ['name' => 'First'], times: 1),
            AssertionFailedError::class,
        );
    }

    public function test_an_argument_of_another_type_fails_the_assert(): void
    {
        $this->journal->owner()->agent('Ada')->sharedInbox('Owner', 'Ada')->sinkCommands();
        $inbox = $this->journal->sharedInboxOf('Owner', 'Ada');

        $this->journal->run(new SendMessageCommand($inbox->id, '7'));

        $this->assertThrows(
            fn () => $this->journal->assertDispatched(SendMessageCommand::class, ['body' => 7]),
            AssertionFailedError::class,
        );
    }

    public function test_a_command_with_a_short_trail_fails_the_whole_frame_assert(): void
    {
        $this->journal->owner()->sinkCommands();
        $command = new SaveLayoutCommand('Writing', LayoutShape::from(SaveLayoutTest::shape('chat')));
        $call = CommandCall::of($command, CommandOwner::CORE, false, false, null)->passedThrough(LogCommand::class);

        $this->journal->actAs('Owner');
        $this->app->make(CommandEnd::class)->finish($call, fn () => null);

        $this->assertThrows(
            fn () => $this->journal->assertPassedEveryMiddleware(SaveLayoutCommand::class),
            AssertionFailedError::class,
        );
    }

    public function test_a_sink_verb_before_the_sink_is_in_place_is_refused(): void
    {
        $this->assertThrows(
            fn () => $this->journal->dispatched(),
            fn (FixtureRefused $refused) => $refused->type === FixtureRefusalType::NoSink,
        );
    }
}
