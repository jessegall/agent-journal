<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Contracts\ChatLines;
use App\Enums\LineCardPlacement;
use App\Support\ActorIdentity;
use App\Values\ChatLine;
use Domain\Chat\Support\DockProjection;
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

    public function test_the_lines_name_the_run_whose_card_marks_the_step_it_is_on(): void
    {
        $this->asOwner();
        $inboxId = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder))->inbox_id;
        $run = SequenceRun::create('Close a task', [self::FIRST_STEP, 'Run the phase tests.']);
        $this->asAgent($this->builder);
        $this->runOnBus(new StartSequenceCommand($run->id, $this->builder->id));
        $this->runOnBus(new AdvanceSequenceCommand($run->id));

        $lines = $this->app->make(ChatLines::class)->linesFrom($inboxId, 0);
        $this->asOwner();
        $cards = $this->app->make(DockProjection::class)->cardsOf(['run' => $lines[0]->source ?? throw new \LogicException()]);
        $states = array_column($this->nodesOf(json_decode((string) json_encode($cards['run']), true)['root']), 'text', 'key');

        $this->assertSame(LineCardPlacement::Panel, $lines[0]->cardPlacement);
        $this->assertSame(['step-1-state' => 'Done', 'step-2-state' => 'Running'], $states);
    }

    /**
     * Every state label in a card's parts, at any depth.
     *
     * @param  array<string, mixed>  $node
     * @return list<array<string, mixed>>
     */
    private function nodesOf(array $node): array
    {
        $own = ($node['type'] ?? null) === 'state-label' ? [$node] : [];
        $children = is_array($node['children'] ?? null) ? $node['children'] : [];

        return [...$own, ...array_merge([], ...array_map($this->nodesOf(...), $children))];
    }
}
