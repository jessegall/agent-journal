<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Commands\RecordRunEvents\RecordRunEventsCommand;
use App\Contracts\Admission\ShellAdmission;
use App\Contracts\Chat\ChatLines;
use App\Enums\ShellDialect;
use App\Models\ProcessRun;
use App\Support\ActorIdentity;
use App\Values\ChatLine;
use App\Values\ExecutionContext;
use Tests\Support\MessagingTestCase;
use Tests\Support\OpensPairChats;

final class LongRunChatCardTest extends MessagingTestCase
{
    use OpensPairChats;

    public function test_an_agents_run_shows_in_its_chat_once_it_outlasts_a_quick_command(): void
    {
        config(['processes.runner' => true]);
        $inboxId = $this->pairChat(ActorIdentity::of($this->owner), $this->actorOf($this->builder))->inbox_id;
        $this->asAgent($this->builder);
        $admission = $this->app->make(ShellAdmission::class)
            ->admit('cat composer.json', ShellDialect::Bash, ExecutionContext::inFolder(base_path()), 'key-1');
        $run = ProcessRun::query()->withoutGlobalScopes()->findOrFail($admission->runId);
        $run->consumeFor('test-key', (string) config('app.key'));

        $this->heartbeat($run, 1);
        $this->assertSame([], $this->sourcesIn($inboxId));

        $this->travel(ProcessRun::QUICK_COMMAND_SECOND_LIMIT + 1)->seconds();
        $this->heartbeat($run, 2);
        $this->heartbeat($run, 3);

        $this->assertSame([ProcessRun::DOCK_TYPE.":{$run->id}"], $this->sourcesIn($inboxId));
    }

    private function heartbeat(ProcessRun $run, int $sequence): void
    {
        $this->runOnBus(new RecordRunEventsCommand(
            $run->id,
            (string) json_encode(['events' => [['sequence' => $sequence, 'type' => 'heartbeat']]]),
        ));
    }

    /**
     * @return list<string>
     */
    private function sourcesIn(string $inboxId): array
    {
        return array_values(array_map(
            fn (ChatLine $line) => "{$line->source?->type}:{$line->source?->id}",
            array_filter(
                $this->app->make(ChatLines::class)->linesFrom($inboxId, 0),
                fn (ChatLine $line) => $line->source !== null,
            ),
        ));
    }
}
