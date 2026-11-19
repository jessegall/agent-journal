<?php

declare(strict_types=1);

namespace Tests\Feature\Communication;

use App\Assignments\Contracts\AssignmentTransaction;
use App\Assignments\Storage\AssignmentStore;
use App\Assignments\Support\AssignmentReference;
use App\Bus\Exceptions\StackLockTimedOut;
use App\Bus\Support\OperationDeadline;
use App\Communication\Commands\ReadMessages;
use App\Communication\Exceptions\InboxUnavailable;
use App\Communication\Models\Message;
use App\Desks\Commands\CreateDesk;
use App\Desks\Contracts\SeatingWriter;
use App\Desks\Models\DeskRecord;
use App\Desks\Models\DeskSeat;
use App\Desks\Support\SeatChange;
use Illuminate\Database\Connection;
use Illuminate\Support\Facades\DB;
use Tests\Support\MessagingTestCase;
use Tests\Support\TimeLimits\TimeLimit;

/**
 * Sends to one desk share its guard with each other but wait for a seating change, which holds it alone; a send that
 * cannot get the guard in time gives up whole. An occupant replaced at a desk keeps neither its claims nor its reads.
 */
#[TimeLimit(seconds: 5, reason: 'One case waits for a database lock held on a second connection to time out.')]
final class MessageConcurrencyTest extends MessagingTestCase
{
    private DeskRecord $desk;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app->instance(OperationDeadline::class, new OperationDeadline(500));
        $this->desk = DeskRecord::query()->findOrFail($this->runOnBus(new CreateDesk('Team', 1, false)));
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(SeatingWriter::class)->seat($this->desk->id, $this->actorOf($this->builder)),
        );
    }

    public function test_a_send_proceeds_while_another_send_holds_the_shared_guard(): void
    {
        $other = $this->otherConnection();
        $other->beginTransaction();
        $other->table('desks')->where('id', $this->desk->id)->sharedLock()->first();

        $messageId = $this->ownerAsks($this->desk->inboxId(), 'Both at once?');
        $other->rollBack();

        $this->assertSame('Both at once?', Message::query()->findOrFail($messageId)->body);
    }

    public function test_a_send_waits_for_a_seating_change_and_gives_up_whole(): void
    {
        $other = $this->otherConnection();
        $other->beginTransaction();
        $other->table('desks')->where('id', $this->desk->id)->lockForUpdate()->first();

        try {
            $this->assertThrows(
                fn () => $this->ownerAsks($this->desk->inboxId(), 'During seating?'),
                StackLockTimedOut::class,
            );
        } finally {
            $other->rollBack();
        }

        $this->assertSame(0, Message::query()->withoutGlobalScopes()->count());
    }

    public function test_a_replaced_occupant_keeps_neither_its_claim_nor_its_reads(): void
    {
        $questionId = $this->ownerAsks($this->desk->inboxId(), 'Who answers?');
        $this->asAgent($this->builder);
        $this->runOnBus(new ReadMessages($this->desk->inboxId(), [$questionId]));
        $this->asOwner();
        $seat = DeskSeat::query()->ofDesk($this->desk)->sole();
        $this->assertCount(1, $this->claimsOn($questionId));

        $change = new SeatChange(
            $this->desk->id,
            $seat->id,
            $this->seatReferenceOf($seat),
            $this->actorOf($this->reviewer),
        );
        $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(SeatingWriter::class)->replace($change),
        );

        $this->assertSame([], $this->claimsOn($questionId));
        $this->asAgent($this->builder);
        $this->assertThrows(
            fn () => $this->runOnBus(new ReadMessages($this->desk->inboxId(), [$questionId])),
            InboxUnavailable::class,
        );
    }

    private function seatReferenceOf(DeskSeat $seat): AssignmentReference
    {
        return $this->app->make(AssignmentTransaction::class)->run(
            fn () => $this->app->make(AssignmentStore::class)
                ->lockCurrent($seat->assignmentIdentity())
                ->get()
                ->reference,
        );
    }

    private function otherConnection(): Connection
    {
        $config = $this->app->make('config');
        $default = $config->get('database.connections.'.$config->get('database.default'));
        $config->set('database.connections.messages_other', $default);

        return DB::connection('messages_other');
    }
}
