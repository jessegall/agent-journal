<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Hosts\Commands\NotifyHostOrder\NotifyHostOrderCommand;
use App\Hosts\Protocol\Data\HostKeysWrittenData;
use App\Hosts\Protocol\Data\HostOpenedData;
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
     * The host answers the order as carried out, with the reply its type declares: an opening names the process's
     * identity, a key write the input generation it raised, and every other order nothing.
     */
    public function answer(): self
    {
        return $this->answerWith(match ($this->order->type->replyData()) {
            HostOpenedData::class => ['identity' => "pid:{$this->order->host_process_id}", 'generation' => 0],
            HostKeysWrittenData::class => ['input_generation' => 1],
            default => [],
        });
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
