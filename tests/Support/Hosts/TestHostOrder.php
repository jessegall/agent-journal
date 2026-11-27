<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Hosts\Commands\NotifyHostOrder\NotifyHostOrderCommand;
use App\Hosts\Protocol\HostRefusal;
use App\Models\Hosts\HostOrder;
use Tests\Support\Seeding\TestJournal;

/**
 * An order the journal made of a host, answered as that host answers it: carried out, with the facts it found, or
 * refused for a reason.
 */
final readonly class TestHostOrder
{
    public function __construct(private TestJournal $journal, private HostOrder $order) {}

    /**
     * The host answers the order as carried out.
     */
    public function answer(): self
    {
        $this->journal->asSystem(new NotifyHostOrderCommand(
            $this->order->host_id,
            $this->order->id,
            json_encode(['order_id' => $this->order->id, 'status' => 'done'], JSON_THROW_ON_ERROR),
        ));

        return $this;
    }

    /**
     * The host answers the order as carried out, with the facts it found.
     *
     * @param  array<string, mixed>  $facts
     */
    public function answerWith(array $facts): self
    {
        $body = json_encode(['order_id' => $this->order->id, 'status' => 'done', 'facts' => $facts], JSON_THROW_ON_ERROR);
        $this->journal->asSystem(new NotifyHostOrderCommand($this->order->host_id, $this->order->id, $body));

        return $this;
    }

    /**
     * The host refuses the order for the reason given.
     */
    public function refuse(HostRefusal $refusal): self
    {
        $body = json_encode(
            ['order_id' => $this->order->id, 'status' => 'refused', 'refusal' => $refusal->value],
            JSON_THROW_ON_ERROR,
        );
        $this->journal->asSystem(new NotifyHostOrderCommand($this->order->host_id, $this->order->id, $body));

        return $this;
    }
}
