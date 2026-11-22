<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Support\ActorIdentity;
use App\Support\ChatLines;
use App\Values\ChatLine;
use Domain\Sequences\Commands\AdvanceSequence\AdvanceSequenceCommand;
use Domain\Sequences\Commands\StartSequence\StartSequenceCommand;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Models\SequenceRun;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

final class SequenceChatLinesTest extends MessagingTestCase
{
    use OpensPairChats;

    private const string FIRST_STEP = 'Read the brief.';

    public function test_a_run_says_in_the_agents_chat_when_it_starts_steps_and_ends_in_that_order(): void
    {
        $this->asOwner();
        $inboxId = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder))->inbox_id;
        $run = SequenceRun::create('Close a task', [self::FIRST_STEP, 'Run the phase tests.']);

        $this->asAgent($this->builder);
        $this->runOnBus(new StartSequenceCommand($run->id, $this->builder->id));
        $this->runOnBus(new AdvanceSequenceCommand($run->id));
        $this->runOnBus(new AdvanceSequenceCommand($run->id));

        $lines = array_map(
            fn (ChatLine $line) => "{$line->subject} · {$line->line}",
            $this->app->make(ChatLines::class)->linesFrom($inboxId, 0),
        );
        $this->assertSame([
            "{$run->name} · started",
            "{$run->name} · {$run->stepLine(1)}",
            "{$run->name} · step 1 ended",
            "{$run->name} · {$run->stepLine(2)}",
            "{$run->name} · step 2 ended",
            "{$run->name} · ".SequenceRunState::Finished->value,
        ], $lines);
    }
}
