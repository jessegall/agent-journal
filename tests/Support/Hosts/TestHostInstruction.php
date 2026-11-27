<?php

declare(strict_types=1);

namespace Tests\Support\Hosts;

use App\Hosts\Commands\NotifyHostInstruction\NotifyHostInstructionCommand;
use App\Hosts\Protocol\HostRefusal;
use App\Hosts\Protocol\Payloads\HostKeysWrittenPayload;
use App\Hosts\Protocol\Payloads\HostOpenedPayload;
use App\Models\Hosts\HostInstruction;
use Tests\Support\Seeding\TestJournal;

/**
 * An instruction the journal made of a host, answered as that host answers it: carried out, with the facts it found, or
 * refused for a reason.
 */
final readonly class TestHostInstruction
{
    public function __construct(private TestJournal $journal, private HostInstruction $instruction) {}

    /**
     * The host answers the instruction as carried out, with the reply its type declares: an opening names the process's
     * identity, a key write the input generation it raised, and every other instruction nothing.
     */
    public function answer(): self
    {
        return $this->answerWith(match ($this->instruction->type->replyPayload()) {
            HostOpenedPayload::class => ['identity' => "pid:{$this->instruction->host_process_id}", 'generation' => 0],
            HostKeysWrittenPayload::class => ['input_generation' => 1],
            default => [],
        });
    }

    /**
     * The host answers the instruction as carried out, with the facts it found.
     *
     * @param  array<string, mixed>  $facts
     */
    public function answerWith(array $facts): self
    {
        $body = json_encode(['instruction_id' => $this->instruction->id, 'status' => 'done', 'facts' => $facts], JSON_THROW_ON_ERROR);
        $this->journal->asSystem(new NotifyHostInstructionCommand($this->instruction->host_id, $this->instruction->id, $body));

        return $this;
    }

    /**
     * The host refuses the instruction for the reason given.
     */
    public function refuse(HostRefusal $refusal): self
    {
        $body = json_encode(
            ['instruction_id' => $this->instruction->id, 'status' => 'refused', 'refusal' => $refusal->value],
            JSON_THROW_ON_ERROR,
        );
        $this->journal->asSystem(new NotifyHostInstructionCommand($this->instruction->host_id, $this->instruction->id, $body));

        return $this;
    }
}
