<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Assignments\Contracts\AssignmentTransaction;
use App\Communication\Commands\TakeNextMessages;
use App\Communication\Data\MessageReadBatch;
use App\Desks\Commands\CreateDesk;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Models\DeskRecord;
use Tests\Support\MessagingTestCase;

/**
 * Members of a shared inbox take its waiting questions one at a time, oldest first: what one member took up is
 * passed over for the next, and an empty queue gives nothing.
 */
final class TakeNextMessagesTest extends MessagingTestCase
{
    public function test_each_member_takes_the_oldest_question_nobody_took_up(): void
    {
        $desk = DeskRecord::query()->findOrFail($this->runOnBus(new CreateDesk('Team', 2, false)));

        foreach ([$this->builder, $this->reviewer] as $session) {
            $this->app->make(AssignmentTransaction::class)->run(
                fn () => $this->app->make(SeatingWriter::class)->seat($desk->id, $this->actorOf($session)),
            );
        }

        $first = $this->ownerAsks($desk->inboxId(), 'First?');
        $second = $this->ownerAsks($desk->inboxId(), 'Second?');

        $this->asAgent($this->builder);
        $builderTook = $this->takeNext($desk);
        $this->asAgent($this->reviewer);
        $reviewerTook = $this->takeNext($desk);
        $nothingLeft = $this->takeNext($desk);

        $this->assertSame([$first], $this->idsOf($builderTook));
        $this->assertSame([$second], $this->idsOf($reviewerTook));
        $this->assertSame([], $this->idsOf($nothingLeft));
    }

    private function takeNext(DeskRecord $desk): MessageReadBatch
    {
        return $this->runOnBus(new TakeNextMessages($desk->inboxId()));
    }

    /**
     * @return list<string>
     */
    private function idsOf(MessageReadBatch $batch): array
    {
        return array_map(fn ($result) => $result->messageId, $batch->results);
    }
}
